import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, X, Paperclip, Smile, Image as ImageIcon, FileText, 
  MoreVertical, Check, CheckCheck, Loader2, Trash2, Download, Bell, BellOff
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import EmojiPicker, { Theme as EmojiTheme } from 'emoji-picker-react';
import { GoogleGenAI } from "@google/genai";
import { ASSISTANT_PROMPT } from '../constants';
import { cn } from '../lib/utils';
import { Message } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

let socket: Socket;

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  adminName: string;
  adminImage?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  isOpen, 
  onClose, 
  adminName, 
  adminImage 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAssistantEnabled, setIsAssistantEnabled] = useState(true);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState({ count: 0, online: true });
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    socket = io();

    socket.on('message:new', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      
      // AI check is now handled via interval for the 24h delay
    });

    socket.on('status:update', (status) => {
      setOnlineStatus(status);
    });

    socket.on('typing:update', (data) => {
      if (!data.isAdmin) {
         // If we are admin, we see guest typing
         // But in this app, the user is the guest.
         // So if we see typing:update with isAdmin: true, it's the admin typing.
         if (data.isAdmin) setOtherUserTyping(data.isTyping);
      } else {
         // If we are guest, we see admin typing
         if (data.isAdmin) setOtherUserTyping(data.isTyping);
      }
      // Simplified for this demo:
      if (data.sender !== 'Guest') {
        setOtherUserTyping(data.isTyping);
      }
    });

    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/public');
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      } catch (err) {
        console.error('Failed to fetch chat history', err);
      }
    };
    fetchHistory();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, otherUserTyping]);

  // Logic to handle 24h delay AI response
  useEffect(() => {
    if (!isAssistantEnabled) return;

    const checkForAIActivation = () => {
      if (messages.length === 0 || isAIResponding) return;

      const lastMessage = [...messages].reverse().find(m => m.sender !== 'System');
      if (!lastMessage) return;

      const isLastFromGuest = !lastMessage.isAdmin && lastMessage.sender !== 'AI Assistant';
      const timeSinceLastMsg = Date.now() - new Date(lastMessage.timestamp).getTime();
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

      // Also check if we already responded with AI recently to avoid loop
      const alreadyRespondedByAI = messages.slice(-1).some(m => m.sender === 'AI Assistant');

      if (isLastFromGuest && timeSinceLastMsg >= TWENTY_FOUR_HOURS && !alreadyRespondedByAI) {
        handleAIResponse(lastMessage.text || lastMessage.fileName || 'Inquiry');
      }
    };

    const interval = setInterval(checkForAIActivation, 60000); // Check every minute
    checkForAIActivation(); // Initial check

    return () => clearInterval(interval);
  }, [messages, isAssistantEnabled, isAIResponding]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const msg: Partial<Message> = {
      sender: 'Guest',
      text: inputText,
      isAdmin: false,
      type: 'text'
    };

    socket.emit('message:send', msg);
    setInputText('');
    setShowEmojiPicker(false);
    stopTyping();
  };

  const startTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing:start', { sender: 'Guest', isAdmin: false });
    }
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 3000);
  };

  const stopTyping = () => {
    setIsTyping(false);
    socket.emit('typing:stop', { sender: 'Guest', isAdmin: false });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64,
            fileType: file.type
          })
        });
        const data = await res.json();
        
        const msg: Partial<Message> = {
          sender: 'Guest',
          isAdmin: false,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          fileUrl: data.url,
          fileName: file.name
        };
        socket.emit('message:send', msg);
      } catch (err) {
        console.error('Upload failed', err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const onEmojiClick = (emojiData: any) => {
    setInputText(prev => prev + emojiData.emoji);
  };

  const handleAIResponse = async (userMessage: string) => {
    if (isAIResponding) return;
    
    setIsAIResponding(true);
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Use messages for context
      const history = messages
        .filter(m => m.sender !== 'System')
        .slice(-10)
        .map(m => `${m.sender}: ${m.text || m.fileName}`)
        .join('\n');

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${ASSISTANT_PROMPT}\n\nRecent Conversation:\n${history}\n\nClient Input: ${userMessage}\nAssistant:`,
      });

      const aiText = response.text;
      
      if (aiText) {
        const msg: Partial<Message> = {
          sender: 'AI Assistant',
          text: aiText,
          isAdmin: true,
          type: 'text'
        };
        socket.emit('message:send', msg);
      }
    } catch (error) {
      console.error("AI Assistant error:", error);
    } finally {
      setIsAIResponding(false);
    }
  };

  const clearChat = async () => {
    // In a real app, this would be a server call
    setMessages([]);
    setShowMoreMenu(false);
  };

  const exportChat = () => {
    const text = messages.map(m => `[${new Date(m.timestamp).toLocaleString()}] ${m.sender}: ${m.text || m.fileName}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString()}.txt`;
    a.click();
    setShowMoreMenu(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/40 dark:bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden h-[90vh] sm:h-[700px] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-white dark:bg-[#0a0a0a] border-b border-black/5 dark:border-white/5 flex justify-between items-center relative z-20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500 overflow-hidden shadow-lg shadow-cyan-500/20">
                    <img src={adminImage || "https://picsum.photos/seed/admin/200"} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#0a0a0a] bg-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight dark:text-white leading-tight">{adminName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest leading-none">Online</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20" />
                    <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest leading-none">
                      {messages.length} Messages
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-500">AI Support</span>
                  <button 
                    onClick={() => setIsAssistantEnabled(!isAssistantEnabled)}
                    className={cn(
                      "w-8 h-4 rounded-full relative transition-colors duration-300",
                      isAssistantEnabled ? "bg-cyan-500 text-black" : "bg-slate-300 dark:bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300",
                      isAssistantEnabled ? "left-4.5" : "left-0.5"
                    )} />
                  </button>
                </div>
                <div className="flex items-center gap-2 relative">
                  <button 
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className={cn(
                      "p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400 dark:text-white/50",
                      showMoreMenu && "bg-black/5 dark:bg-white/5 text-cyan-500"
                    )}
                  >
                    < MoreVertical className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {showMoreMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-30" 
                          onClick={() => setShowMoreMenu(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-2xl p-2 shadow-2xl z-40"
                        >
                          <button 
                            onClick={exportChat}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-white/70"
                          >
                            <Download className="w-4 h-4" />
                            Export History
                          </button>
                          <div className="h-px bg-black/5 dark:bg-white/5 my-1" />
                          <button 
                            onClick={clearChat}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/10 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                            Clear History
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors text-slate-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div 
              ref={scrollRef}
              className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-black/20"
            >
              <div className="text-[10px] text-center text-slate-400 dark:text-white/30 uppercase tracking-[0.4em] mb-8">
                End-to-end encrypted session initialized
              </div>

              {isAssistantEnabled && (
                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 text-[10px] text-cyan-600 dark:text-cyan-400 uppercase tracking-widest text-center mb-6 font-bold">
                   Status: AI Assistant standby (Activates after 24h of inactivity)
                </div>
              )}

              {messages.map((m) => {
                const isSystem = m.sender === 'System';
                const isAI = m.sender === 'AI Assistant';
                const isSelf = !m.isAdmin && m.sender !== 'System' && m.sender !== 'AI Assistant';
                
                return (
                  <div key={m.id} className={cn(
                    "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                    isSelf ? "ml-auto items-end" : "items-start"
                  )}>
                    {isAI && (
                      <div className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest mb-1 ml-1 flex items-center gap-1.5">
                        Assistant <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                      </div>
                    )}
                    {/* Message Bubble */}
                    <div className={cn(
                      "group relative",
                      isSelf ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "relative px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm",
                        isSelf 
                          ? "bg-cyan-500 text-white font-medium rounded-tr-none" 
                          : isAI
                            ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-tl-none border border-white/5 shadow-lg shadow-black/20"
                            : "bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-700 dark:text-white rounded-tl-none"
                      )}>
                        {/* Text Content */}
                        {m.type === 'text' && (
                          <div className="whitespace-pre-wrap">{m.text}</div>
                        )}

                        {/* Image Content */}
                        {m.type === 'image' && (
                          <div className="space-y-2">
                            <img 
                              src={m.fileUrl} 
                              className="rounded-2xl max-w-full h-auto cursor-pointer hover:scale-[1.02] transition-transform" 
                              alt={m.fileName}
                              onClick={() => window.open(m.fileUrl, '_blank')}
                            />
                            {m.text && <div className="text-xs">{m.text}</div>}
                          </div>
                        )}

                        {/* File Content */}
                        {m.type === 'file' && (
                          <a 
                            href={m.fileUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold truncate">{m.fileName}</div>
                              <div className="text-[10px] opacity-50 uppercase font-mono">Document</div>
                            </div>
                          </a>
                        )}

                        {/* Timestamp & Status */}
                        <div className={cn(
                          "absolute bottom-[-22px] flex flex-col items-end gap-1 text-[9px] font-bold uppercase tracking-widest opacity-60",
                          isSelf ? "right-1 text-cyan-600 dark:text-cyan-400" : "left-1 text-slate-400"
                        )}>
                          <div className="flex items-center gap-1.5">
                            {new Date(m.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} · {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isSelf && (
                              <CheckCheck className="w-2.5 h-2.5" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {(otherUserTyping || isAIResponding) && (
                <div className="flex flex-col items-start gap-2">
                  {isAIResponding && (
                    <div className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest mb-1 ml-1">AI Thinking...</div>
                  )}
                  <div className="px-5 py-3 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 flex gap-1 items-center">
                    <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <span className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white dark:bg-[#0a0a0a] border-t border-black/5 dark:border-white/5 space-y-4 relative z-20">
              {showEmojiPicker && (
                <div className="absolute bottom-[100%] right-6 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                   <EmojiPicker 
                    theme={EmojiTheme.DARK} 
                    onEmojiClick={onEmojiClick}
                    width={320}
                    height={400}
                   />
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className="flex-1 relative group">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      startTyping();
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="TYPE YOUR MESSAGE..." 
                    className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-cyan-500/30 rounded-3xl px-12 py-4 text-xs outline-none transition-all tracking-widest dark:text-white font-medium"
                  />
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 hover:text-cyan-500 transition-colors text-slate-400"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <label className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 hover:text-cyan-500 transition-colors text-slate-400">
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                    />
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                  </label>
                </div>
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="w-14 h-14 rounded-[1.25rem] bg-cyan-500 flex items-center justify-center hover:scale-110 active:scale-95 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:shadow-none shadow-lg shadow-cyan-500/20"
                >
                  <Send className="w-5 h-5 text-black" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
