/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, MessageSquare, Cpu, 
  Sun, Moon
} from 'lucide-react';
import { cn } from './lib/utils';
import type { DBData } from './types';
import { ChatInterface } from './components/ChatInterface';

// Modularized Components
import { BackgroundScene } from './components/common/BackgroundScene';
import { Home } from './components/sections/home';
import { About } from './components/sections/about';
import { Service } from './components/sections/service';
import { MyWork } from './components/sections/mywork';
import { Skill } from './components/sections/skill';
import { ExpEdu } from './components/sections/ExpEdu';
import { Contact } from './components/sections/contact';

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'services' | 'portfolio' | 'skills' | 'edu_exp' | 'contact'>('home');
  const [dbData, setDbData] = useState<DBData | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [portfolioFilter, setPortfolioFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public')
      .then(res => {
        if (!res.ok) throw new Error('System still initializing or database not connected');
        return res.json();
      })
      .then(data => {
        setDbData(data);
        if (data.settings?.theme) setTheme(data.settings.theme);
      })
      .catch(err => {
        console.error(err);
        // We'll keep the loading screen up if there's no user data
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  if (isLoading || !dbData || !dbData.user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-[200]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/20 animate-pulse" />
            <Cpu className="w-10 h-10 text-cyan-500 animate-bounce" />
          </div>
          <div className="text-[10px] uppercase font-black tracking-[0.6em] text-cyan-500/50 animate-pulse">
            System Initializing
          </div>
        </div>
      </div>
    );
  }

  const NavTabs = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Me' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'My Work' },
    { id: 'skills', label: 'Skill' },
    { id: 'edu_exp', label: 'Exp @ Edu' },
    { id: 'contact', label: 'Contact Me' },
  ];

  return (
    <div className={cn("min-h-screen font-sans selection:bg-cyan-500/30 selection:text-white transition-colors duration-500")}>
      <BackgroundScene theme={theme} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 md:px-10 flex justify-between items-center glass-panel rounded-none border-t-0 border-x-0 shadow-2xl backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold tracking-tighter flex items-center gap-1 uppercase text-slate-900 dark:text-white"
        >
          {(dbData.user?.name || 'EPHREM').split(' ')[0]}<span className="text-cyan-400">.</span>DESIGN
        </motion.div>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NavTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "text-[10px] xl:text-[11px] letter-spacing-[0.2em] font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer pb-1",
                activeTab === tab.id ? "text-cyan-600 dark:text-cyan-400 border-b border-cyan-600 dark:border-cyan-400" : "text-slate-500 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400"
              )}
            >
              {tab.label}
            </button>
          ))}
          
          <button
            onClick={async () => {
              const newTheme = theme === 'light' ? 'dark' : 'light';
              setTheme(newTheme);
              await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: newTheme })
              });
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center glass-panel border-white/20 hover:scale-110 transition-all text-slate-600 dark:text-cyan-400 pointer-events-auto shadow-lg"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={async () => {
              const newTheme = theme === 'light' ? 'dark' : 'light';
              setTheme(newTheme);
              await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: newTheme })
              });
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center glass-panel border-white/20 text-slate-600 dark:text-cyan-400"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button onClick={() => setChatOpen(!chatOpen)} className="p-2 dark:text-white"><MessageSquare className="w-5 h-5" /></button>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 dark:text-white">
            <Menu className="w-6 h-6 text-gray-500 dark:text-white" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Shimmer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full xs:w-80 md:w-96 z-[150] bg-slate-900 border-l border-white/10 flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="text-sm font-black tracking-[0.3em] uppercase text-white">
                  MENU<span className="text-cyan-400">.</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col">
                {NavTabs.map((tab, idx) => (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "group flex items-center gap-4 py-4 border-b border-white/5 text-left transition-all relative overflow-hidden",
                      activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <span className="font-mono text-[10px] text-cyan-500/50 group-hover:text-cyan-400">0{idx + 1}</span>
                    <span className={cn(
                      "text-sm md:text-base font-bold uppercase tracking-[0.2em] transition-all",
                      activeTab === tab.id ? "translate-x-2" : "group-hover:translate-x-1"
                    )}>
                      {tab.label}
                    </span>
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeSideNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-cyan-500 rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-auto pt-16">
                <div className="text-[9px] uppercase tracking-[0.4em] text-slate-500 mb-6 font-bold">CORE NAVIGATION</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[8px] uppercase tracking-widest text-slate-500 mb-1">Theme</div>
                    <button 
                      onClick={async () => {
                        const newTheme = theme === 'light' ? 'dark' : 'light';
                        setTheme(newTheme);
                        await fetch('/api/settings', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ theme: newTheme })
                        });
                      }}
                      className="text-[10px] font-bold text-white uppercase flex items-center gap-2"
                    >
                      {theme === 'dark' ? <Sun className="w-3 h-3 text-cyan-400" /> : <Moon className="w-3 h-3 text-cyan-400" />}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[8px] uppercase tracking-widest text-slate-500 mb-1">Chat AI</div>
                    <button 
                      onClick={() => {
                        setChatOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="text-[10px] font-bold text-white uppercase flex items-center gap-2"
                    >
                      <MessageSquare className="w-3 h-3 text-cyan-400" />
                      Connect
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                {Object.entries(dbData.user?.socials || {}).map(([key, url]: [string, any], i) => {
                  const LogosMap: any = { 
                    instagram: "https://www.vectorlogo.zone/logos/instagram/instagram-icon.svg", 
                    whatsapp: "https://www.vectorlogo.zone/logos/whatsapp/whatsapp-icon.svg", 
                    facebook: "https://www.vectorlogo.zone/logos/facebook/facebook-official.svg", 
                    linkedin: "https://www.vectorlogo.zone/logos/linkedin/linkedin-icon.svg", 
                    tiktok: "https://www.vectorlogo.zone/logos/tiktok/tiktok-icon.svg" 
                  };
                  const logo = LogosMap[key];
                  if (!logo) return null;
                  return (
                    <a key={key} href={url} target="_blank" className="w-8 h-8 p-1.5 glass-panel rounded-lg hover:bg-white transition-all flex items-center justify-center">
                      <img src={logo} alt={key} className="w-full h-full object-contain" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative pt-32 md:pt-40 pb-32 px-6 md:px-10 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <Home dbData={dbData} setChatOpen={setChatOpen} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'about' && (
            <About setActiveTab={setActiveTab} />
          )}

          {activeTab === 'services' && (
            <Service dbData={dbData} />
          )}

          {activeTab === 'portfolio' && (
            <MyWork dbData={dbData} portfolioFilter={portfolioFilter} setPortfolioFilter={setPortfolioFilter} />
          )}

          {activeTab === 'skills' && (
            <Skill dbData={dbData} setActiveTab={setActiveTab} setPortfolioFilter={setPortfolioFilter} />
          )}

          {activeTab === 'edu_exp' && (
            <ExpEdu dbData={dbData} />
          )}

          {activeTab === 'contact' && (
            <Contact dbData={dbData} setChatOpen={setChatOpen} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer-like status bar */}
      <footer className="fixed bottom-0 left-0 right-0 px-6 py-6 md:px-10 md:py-10 flex justify-between items-end pointer-events-none max-w-7xl mx-auto z-40">
        <div className="flex gap-4 md:gap-10 items-center pointer-events-auto">
          <div className="w-10 h-10 md:w-12 md:h-12 glass-panel rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-help group">
            <div className="w-5 h-5 md:w-6 md:h-6 border-t-2 border-white rounded-full animate-spin-slow group-hover:border-cyan-400 transition-colors" />
          </div>
          <div className="text-[9px] md:text-[10px] text-slate-500 dark:text-white uppercase tracking-widest leading-tight hidden sm:block">
            Designer Profile: <span className="text-slate-900 dark:text-white">Active</span><br />
            System Clock: <span className="text-slate-900 dark:text-white">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex gap-3 md:gap-8 items-center pointer-events-auto">
          <div className="text-right hidden md:block">
            <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 dark:text-white mb-1 font-bold">Secure Core</div>
            <div className="text-[10px] md:text-xs font-medium text-cyan-400">STATUS: ENCRYPTED</div>
          </div>
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className="w-12 h-12 md:w-14 md:h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-110 transition-all active:scale-95 group"
          >
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-black group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
      </footer>

      {/* Modern Real-Time Chat Interface */}
      <ChatInterface 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        adminName={dbData.user?.name || 'Ephrem'}
        adminImage={dbData.user?.image}
      />

      <style>{`
        html { scroll-behavior: smooth; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
