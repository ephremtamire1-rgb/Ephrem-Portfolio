import React from 'react';
import { motion } from 'motion/react';
import { MotionText } from '../common/MotionText';
import { Card3D } from '../common/Card3D';

interface AboutProps {
  setActiveTab: (tab: any) => void;
}

export const About: React.FC<AboutProps> = ({ setActiveTab }) => {
  return (
    <motion.section
      key="about"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
    >
      <div className="order-2 md:order-1">
        <Card3D className="aspect-square max-w-md mx-auto" glow>
          <motion.img 
            whileHover={{ rotateY: 180 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            src="input_file_1.png" 
            alt="Ephrem Tamire Portrait" 
            className="w-full h-full object-cover cursor-pointer"
            referrerPolicy="no-referrer"
          />
        </Card3D>
      </div>
      <div className="order-1 md:order-2 space-y-8">
        <MotionText delay={0.1}>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">About Me</h2>
          <div className="h-1 w-20 bg-cyan-500 mt-4" />
        </MotionText>
        
        <MotionText delay={0.2}>
          <p className="text-slate-600 dark:text-white text-lg leading-relaxed font-light">
            I am a passionate Graphic Designer with a deep focus on creating high-end 3D graphics and digital brand experiences. My approach combines technical precision with artistic flair, ensuring every pixel serves a purpose.
          </p>
        </MotionText>

        <div className="grid grid-cols-2 gap-8 pt-8">
          <MotionText delay={0.3} className="space-y-2 p-6 glass-panel shadow-xl">
            <div className="text-cyan-600 dark:text-cyan-400 font-black text-4xl leading-none">05+</div>
            <div className="text-[10px] tracking-widest text-slate-500 dark:text-white uppercase font-bold">Years of Experience</div>
          </MotionText>
          <MotionText delay={0.4} className="space-y-2 p-6 glass-panel shadow-xl">
            <div className="text-cyan-600 dark:text-cyan-400 font-black text-4xl leading-none">150+</div>
            <div className="text-[10px] tracking-widest text-slate-500 dark:text-white uppercase font-bold">Projects Complete</div>
          </MotionText>
        </div>
        
        <MotionText delay={0.5}>
          <button 
            onClick={() => setActiveTab('contact')}
            className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all active:scale-95 shadow-xl shadow-black/10 dark:shadow-none"
          >
            Get in Touch
          </button>
        </MotionText>
      </div>
    </motion.section>
  );
};
