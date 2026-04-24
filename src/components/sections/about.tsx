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
      <div className="order-2 md:order-1 relative">
        <div className="relative max-w-md mx-auto">
          {/* Top-Left Overlap - Larger and more Card-like */}
          <motion.div 
            initial={{ opacity: 0, x: -60, y: -60, rotate: -20 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: -10 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute -top-16 -left-16 w-40 h-52 z-20 rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl border border-white/10"
          >
            <img 
              src="https://picsum.photos/seed/about_detail_1/500/600" 
              alt="Detail 1" 
              className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Main Portrait Card */}
          <Card3D className="aspect-square relative z-10" glow>
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              src="/img/Efa 1.png" 
              alt="Ephrem Tamire Portrait" 
              className="w-full h-full object-cover cursor-pointer grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </Card3D>

          {/* Bottom-Right Overlap - Larger and more Card-like */}
          <motion.div 
            initial={{ opacity: 0, x: 60, y: 60, rotate: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: 10 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="absolute -bottom-16 -right-16 w-44 h-56 z-20 rounded-3xl overflow-hidden glass-panel p-2 shadow-2xl border border-white/10"
          >
            <img 
              src="https://picsum.photos/seed/about_detail_2/500/600" 
              alt="Detail 2" 
              className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
      <div className="order-1 md:order-2 space-y-8">
        <MotionText delay={0.5}>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">About Me</h2>
          <div className="h-1 w-20 bg-cyan-500 mt-4" />
        </MotionText>
        
        <MotionText delay={0.5}>
          <p className="text-slate-600 dark:text-white text-lg leading-relaxed font-light">
             I am a passionate Graphic Designer with a strong focus on creating modern, high-quality visual designs and impactful brand identities.
             My approach combines creative thinking with precision, ensuring that every element is carefully designed to communicate clearly and effectively. 
             I believe that great design is not just about how it looks, but how it works and connects with people.
             I specialize in crafting clean, professional, and visually engaging graphics that help brands stand out and leave a lasting impression.
          </p>
        </MotionText>

        <div className="grid grid-cols-2 gap-8 pt-8">
          <MotionText delay={0.5} className="space-y-2 p-6 glass-panel shadow-xl">
            <div className="text-cyan-600 dark:text-cyan-400 font-black text-4xl leading-none">05+</div>
            <div className="text-[10px] tracking-widest text-slate-500 dark:text-white uppercase font-bold">Years of Experience</div>
          </MotionText>
          <MotionText delay={0.5} className="space-y-2 p-6 glass-panel shadow-xl">
            <div className="text-cyan-600 dark:text-cyan-400 font-black text-4xl leading-none">100+</div>
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
