import express from 'express';
import { createServer as createHttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Helper to read/write local db.json
async function getDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { user: {}, projects: [], skills: [], education: [], experience: [], services: [], messages: [], settings: { theme: 'dark' } };
  }
}

async function saveDB(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Ensure uploads directory exists
async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

async function startServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  const io = new SocketServer(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
  });

  const PORT = 3000;

  // Serve uploads
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Diagnostic log
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Ensure directories
  await ensureUploadsDir();

  // In-memory status tracking
  const activeUsers = new Set();

  // Socket management
  io.on('connection', (socket) => {
    activeUsers.add(socket.id);
    io.emit('status:update', { count: activeUsers.size, online: true });

    socket.on('message:send', async (msg) => {
      const db = await getDB();
      const newMessage = { 
        ...msg, 
        id: uuidv4(),
        timestamp: new Date().toISOString()
      };
      
      db.messages.push(newMessage);
      await saveDB(db);
      
      // Auto-reply logic: Welcome message (First time or after 5 days)
      const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;
      const guestMessages = (db.messages || []).filter((m: any) => !m.isAdmin && m.sender !== 'System');
      const guestMessageCount = guestMessages.length;
      
      let shouldWelcome = false;
      if (guestMessageCount === 1) {
        shouldWelcome = true;
      } else if (guestMessageCount > 1 && !msg.isAdmin) {
        // Find previous guest message to check gap
        const prevMsg = guestMessages[guestMessages.length - 2];
        const gap = new Date(newMessage.timestamp).getTime() - new Date(prevMsg.timestamp).getTime();
        if (gap >= FIVE_DAYS) {
          shouldWelcome = true;
        }
      }

      if (shouldWelcome && !msg.isAdmin) {
        const welcomeMsg = {
          id: uuidv4(),
          sender: 'AI Assistant',
          text: "Hello 👋\nThank you for reaching out to Ephrem Tamire Design Studio.\nI'm here to assist you while Ephrem is working on ongoing projects.\n\nCould you please tell me a bit about your project? I'd be happy to guide you and provide a rough estimate.",
          isAdmin: true,
          timestamp: new Date().toISOString(),
          type: 'text'
        };
        db.messages.push(welcomeMsg);
        await saveDB(db);
        setTimeout(() => io.emit('message:new', welcomeMsg), 500);
      }

      io.emit('message:new', newMessage);
    });

    socket.on('typing:start', (data) => {
      socket.broadcast.emit('typing:update', { ...data, isTyping: true });
    });

    socket.on('typing:stop', (data) => {
      socket.broadcast.emit('typing:update', { ...data, isTyping: false });
    });

    socket.on('disconnect', () => {
      activeUsers.delete(socket.id);
      io.emit('status:update', { count: activeUsers.size, online: activeUsers.size > 0 });
    });
  });

  // --- API Routes ---

  // Simple Base64 File Upload
  app.post('/api/upload', async (req, res) => {
    const { fileName, fileData, fileType } = req.body;
    if (!fileData || typeof fileData !== 'string') return res.status(400).json({ error: 'Valid file data as string is required' });

    const base64Data = fileData.replace(/^data:.*?;base64,/, "");
    const ext = path.extname(fileName) || (fileType?.includes('image') ? '.png' : '.bin');
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);

    await fs.writeFile(filePath, base64Data, 'base64');
    res.json({ url: `/uploads/${safeName}` });
  });

  // Public Data
  app.get('/api/public', async (req, res) => {
    try {
      const db = await getDB();
      res.json(db);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch public data' });
    }
  });

  // Contact/Messages
  app.post('/api/messages', async (req, res) => {
    try {
      const db = await getDB();
      const newMessage = { ...req.body, id: uuidv4(), timestamp: new Date().toISOString() };
      if (!db.messages) db.messages = [];
      db.messages.push(newMessage);
      await saveDB(db);
      io.emit('message:new', newMessage);
      res.json(newMessage);
    } catch (err) {
      res.status(500).json({ error: 'Failed to save message' });
    }
  });

  // Theme/Settings Persistence
  app.post('/api/settings', async (req, res) => {
    try {
      const db = await getDB();
      db.settings = { ...(db.settings || {}), ...req.body };
      await saveDB(db);
      res.json(db.settings);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // --- Vite / Static Handling ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start listening
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 EPHREM.DESIGN Server is live on http://localhost:${PORT}`);
  });
}

startServer();
