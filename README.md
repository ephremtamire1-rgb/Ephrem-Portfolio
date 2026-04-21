# Aura 3D Portfolio - Developer Documentation

Welcome to the **Aura 3D Portfolio** source code. This project is a high-performance, visually immersive portfolio designed for graphics designers and 3D artists. It features real-time chat, 3D visualizations, and a fully customizable local data store.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS 4
- **Animation:** GSAP, Motion (framer-motion), CSS Glassmorphism
- **3D Engine:** Three.js / @react-three/fiber / @react-three/drei
- **Real-time:** Socket.io-client

### Backend
- **Runtime:** Node.js (Express.js)
- **Real-time:** Socket.io (WebSockets)
- **Storage:** Local Flat-file Base (`db.json`)
- **AI Integration:** Google Gemini API (@google/genai)

---

## 🏗️ Architecture: Local-First Flat-File DB

This application is designed for extreme portability. It does **not** requires an external database (MongoDB/SQL). Instead, it uses an asynchronous file-based system located in the project root.

- **Data Store:** `db.json`
- **Logic:** Handled in `server.ts` via `getDB()` and `saveDB()` helpers.
- **Benefits:** 0ms latency for public data, easy backups, and zero-cost hosting.

> For a complete mapping of the data models, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).

---

## 📁 Project Structure

```text
├── server.ts            # Express server & WebSocket logic
├── db.json              # Local data storage (JSON)
├── uploads/             # Directory for uploaded files/images
├── src/
│   ├── App.tsx          # Main Application Entry & Routing
│   ├── components/      # Reusable UI Components
│   │   ├── ChatInterface.tsx  # Real-time chat & AI assistance
│   │   ├── Portfolio3D.tsx    # Interactive 3D Canvas
│   │   └── ...
│   ├── lib/             # Utility functions & helpers
│   └── index.css        # Global Tailwind & Animations
├── public/              # Static assets (3D models, textures)
└── README.md            # You are here
```

---

## 📡 API Reference

The server exposes a REST API for data management and persistence.

### GET `/api/public`
Returns the entire portfolio state (user, projects, skills, messages, etc.).

### POST `/api/messages`
Saves a new chat message to the history.
**Payload:** `{ sender: string, text: string, isAdmin: boolean }`

### POST `/api/upload`
Handles small asset uploads (Base64).
**Payload:** `{ fileName: string, fileData: string, fileType: string }`

### POST `/api/settings`
Persists site settings like theme (dark/light).
**Payload:** `{ theme: 'dark' | 'light' }`

---

## 💬 Real-time Features (Socket.io)

The application uses WebSockets for interactive experiences:
- **`message:send`**: Emit from client to send a message.
- **`message:new`**: Broadcasted to all clients when a new message arrives.
- **`typing:start / typing:stop`**: Broadcasts user typing indicators.
- **`status:update`**: Broadcasts the count of active online users.

---

## 🛠️ Development & Build

### Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (runs Express + Vite middleware):
   ```bash
   npm run dev
   ```

### Building for Production
1. Compile the frontend and backend:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

---

## 🎨 Design Philosophy

The portfolio uses a **Glassmorphic / Futuristic** aesthetic. 
- **Shadows:** Soft interactive shadows using Tailwind.
- **Layout:** Responsive Flex/Grid with GSAP staggered entrance animations.
- **Interactivity:** Hover-based 3D transformations on project cards.

---

## 🛠️ Customization

To update the portfolio content without touching code, simply edit `db.json` directly. The frontend will hot-reload the data on the next refresh.

**Ephrem Tamire - Design & Engineering**
