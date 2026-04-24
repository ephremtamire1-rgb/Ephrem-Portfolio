import React from 'react';
import { motion } from 'motion/react';
import { MotionText } from '../common/MotionText';
import { Card3D } from '../common/Card3D';
import { DBData } from '../../types';
import { cn } from '../../lib/utils';

interface SkillProps {
  dbData: DBData;
  setActiveTab: (tab: any) => void;
  setPortfolioFilter: (filter: string) => void;
}

export const Skill: React.FC<SkillProps> = ({ dbData, setActiveTab, setPortfolioFilter }) => {
  return (
    <motion.section
      key="skills"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-16"
    >
      <div className="space-y-8">
        <MotionText delay={0.1}>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">My Professional Skills</h2>
        </MotionText>
        <MotionText delay={0.2}>
          <p className="text-slate-600 dark:text-white leading-relaxed font-light">
            I specialize in Adobe Creative Suite and modern 3D visualization tools to deliver world-class graphics.
          </p>
        </MotionText>
        <div className="space-y-6">
          {(dbData.skills || []).map((skill, idx) => (
            <div 
              key={idx} 
              className="group space-y-2 cursor-pointer"
              onClick={() => {
                const relatedCat = skill.name.toLowerCase().includes('3d') || skill.name.toLowerCase().includes('blender') ? '3D' : 'Graphics';
                setPortfolioFilter(relatedCat);
                setActiveTab('portfolio');
              }}
            >
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-slate-700 dark:text-white">
                <span className="flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", idx % 2 === 0 ? "bg-cyan-500 dark:bg-cyan-400" : "bg-slate-900 dark:bg-white")} />
                  {skill.name}
                </span>
                <span className="text-cyan-600 dark:text-cyan-400">{skill.level}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-white/5 w-full relative rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="absolute h-full bg-gradient-to-r from-cyan-600 to-cyan-400 dark:from-cyan-500 dark:to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all" 
                />
              </div>
              <div className="text-[8px] text-gray-400 dark:text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                 Click to view related {skill.name.toLowerCase().includes('3d') ? '3D' : 'Graphic'} artifacts
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
         <Card3D className="aspect-square" glow>
            <motion.img 
              whileHover={{ rotateY: -180, filter: "brightness(1.2)" }}
              transition={{ duration: 0.8, ease: "circOut" }}
              src="input_file_2.png" 
              className="w-full h-full object-cover cursor-pointer" 
            />
         </Card3D>
      </div>
    </motion.section>
  );
};
