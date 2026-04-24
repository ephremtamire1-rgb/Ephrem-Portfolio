import React from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import { MotionText } from '../common/MotionText';
import { Card3D } from '../common/Card3D';
import { DBData } from '../../types';

interface HomeProps {
  dbData: DBData;
  setChatOpen: (open: boolean) => void;
  setActiveTab: (tab: any) => void;
}

export const Home: React.FC<HomeProps> = ({ dbData, setChatOpen, setActiveTab }) => {
  return (
    <motion.section
      key="home"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-12 gap-8 items-center min-h-[70vh]"
    >
      <div className="col-span-12 md:col-span-7 lg:col-span-6 flex flex-col justify-center text-center md:text-left">
        <MotionText delay={0.2} className="mb-6">
          <span className="glass-panel px-4 py-1 text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-cyan-700 dark:text-cyan-200 font-bold border-cyan-500/10 dark:border-cyan-400/30">
            {dbData.user?.title || 'Graphics Designer'}
          </span>
        </MotionText>
        
        <MotionText delay={0.3}>
          <h1 className="hero-text text-[clamp(2.5rem,15vw,6rem)] md:text-[clamp(4rem,10vw,8rem)] lg:text-[clamp(5rem,12vw,100px)] font-black tracking-tighter leading-[0.85] mb-8 uppercase text-slate-900 dark:text-white">
            {(dbData.user?.name || 'EPHREM').split(' ')[0]}<br />{(dbData.user?.name || 'TAMIRE').split(' ')[1] || 'TAMIRE'}<span className="text-cyan-400"></span>
          </h1>
        </MotionText>

        <MotionText delay={0.4}>
          <p className="text-slate-600 dark:text-white text-lg md:text-xl leading-relaxed max-w-lg mb-10 font-light">
            {dbData.user?.bio}
            <br />
            <br />
            I create visually compelling designs that combine creativity, clarity, and precision. 
            My work focuses on building strong brand identities and delivering high-quality graphics that leave a lasting impression.
          </p>
        </MotionText>

        <MotionText delay={0.5} className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 mt-4">
          <button 
            onClick={() => setChatOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.3em] text-[10px] shadow-[0_20px_40px_rgba(34,211,238,0.2)] dark:shadow-none hover:shadow-cyan-500/40 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Hire Me <Send className="w-3 h-3" />
          </button>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-6 group cursor-pointer" 
            onClick={() => setActiveTab('portfolio')}
          >
            <div className="w-14 h-14 rounded-full border border-slate-900/10 dark:border-white/20 flex items-center justify-center transition-all group-hover:border-cyan-500 dark:group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] shadow-lg shadow-black/5 dark:shadow-none">
              <div className="w-2 h-2 bg-slate-400 dark:bg-white rounded-full group-hover:bg-cyan-500 dark:group-hover:bg-cyan-400 transition-colors" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-white transition-colors">Explore Works</span>
          </motion.div>
        </MotionText>
      </div>

      <div className="col-span-12 md:col-span-5 lg:col-span-6 relative flex items-center justify-center md:justify-end">
        <div className="relative w-full max-w-lg">
          {/* Top-Left Overlap - Larger and more defined */}
          <motion.div 
            initial={{ opacity: 0, x: -50, y: -50, rotate: -20 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: -10 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="absolute -top-20 -left-10 w-44 h-56 z-20 rounded-3xl overflow-hidden glass-panel p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] hidden sm:block border border-white/10"
          >
            <img src="https://picsum.photos/seed/home_landscape/600/800" className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity p-4 flex items-end">
               <span className="text-[8px] text-white font-black tracking-widest uppercase">Abstract I</span>
            </div>
          </motion.div>

          <div className="project-card-container transform md:rotate-y-[-15deg] md:rotate-x-[10deg] transform-style-3d w-full relative z-10 transition-transform duration-700">
            <Card3D className="aspect-[4/5] p-3" glow>
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                src="public/img/Efa1.png" 
                alt="Ephrem Tamire" 
                className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-1000 cursor-pointer"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-8 left-8 text-white/40 font-black text-6xl tracking-tighter select-none pointer-events-none uppercase">
                AETHER
              </div>
            </Card3D>
          </div>

          {/* Bottom-Right Overlap - Larger and more defined */}
          <motion.div 
            initial={{ opacity: 0, x: 50, y: 50, rotate: 20 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 10 }}
            transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
            className="absolute -bottom-20 -right-10 w-48 h-64 z-20 rounded-3xl overflow-hidden glass-panel p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] hidden sm:block border border-white/10"
          >
            <img src="https://picsum.photos/seed/home_portrait/600/800" className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity p-4 flex items-end">
               <span className="text-[8px] text-white font-black tracking-widest uppercase">Abstract II</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
