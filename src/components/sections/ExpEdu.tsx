import React from 'react';
import { motion } from 'motion/react';
import { Cpu, LayoutGrid, ShieldCheck } from 'lucide-react';
import { MotionText } from '../common/MotionText';
import { Card3D } from '../common/Card3D';
import { DBData } from '../../types';

interface ExpEduProps {
  dbData: DBData;
}

export const ExpEdu: React.FC<ExpEduProps> = ({ dbData }) => {
  return (
    <motion.section
      key="edu_exp"
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      className="space-y-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Experience */}
        <div className="space-y-12">
          <MotionText delay={0.1} className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl glass-panel shadow-lg flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Work Experience</h2>
          </MotionText>
          <div className="space-y-10">
            {(dbData.experience || []).map((exp, idx) => (
              <Card3D key={idx} className="relative p-6 sm:p-8 border-l-4 border-cyan-500 dark:border-cyan-400 group hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                <div className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-2">{exp.period}</div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-slate-900 dark:text-white uppercase">{exp.position}</h3>
                <div className="text-slate-500 dark:text-white font-bold text-xs uppercase tracking-widest mb-4">{exp.company}</div>
                <p className="text-xs text-slate-600 dark:text-white leading-relaxed font-light mb-4">{exp.description}</p>
                {exp.tasks && (
                  <div className="space-y-2">
                     {exp.tasks.map((task, tidx) => (
                       <div key={tidx} className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-white font-mono">
                          <div className="w-1 h-1 bg-cyan-500 rounded-full" />
                          {task}
                       </div>
                     ))}
                  </div>
                )}
              </Card3D>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-12">
          <MotionText delay={0.1} className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl glass-panel shadow-lg flex items-center justify-center text-slate-900 dark:text-white">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Education</h2>
          </MotionText>
          <div className="space-y-10">
            {(dbData.education || []).map((edu, idx) => (
              <Card3D key={idx} className="relative p-6 sm:p-8 border-l-4 border-slate-900 dark:border-white group hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                <div className="text-[10px] font-bold text-slate-400 dark:text-white uppercase tracking-widest mb-2">{edu.year}</div>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-slate-900 dark:text-white">{edu.degree}</h3>
                <div className="text-slate-500 dark:text-white font-bold text-xs uppercase tracking-widest mb-4">{edu.institution}</div>
                <p className="text-xs text-slate-600 dark:text-white leading-relaxed font-light mb-4">{edu.description}</p>
                
                {edu.keyPoints && (
                  <div className="space-y-3">
                     <div className="text-[9px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">{edu.keyPointsTitle || 'Key Highlights:'}</div>
                     <div className="grid grid-cols-1 gap-2">
                       {edu.keyPoints.map((point, pidx) => (
                         <div key={pidx} className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-white font-mono italic">
                            <span className="text-slate-900 dark:text-white group-hover:opacity-100 transition-opacity">•</span>
                            {point}
                         </div>
                       ))}
                     </div>
                  </div>
                )}
              </Card3D>
            ))}
          </div>
        </div>
      </div>

      {/* Certificates */}
      <div className="space-y-12">
        <MotionText delay={0.3} className="text-center">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Achievements & Certs</h2>
          <p className="text-slate-500 dark:text-white mt-2 font-light">Validating the expertise through professional certification.</p>
        </MotionText>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {(dbData.certificates || []).map((cert, idx) => (
            <Card3D key={idx} className="group overflow-hidden h-full">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest mb-1">{cert.year}</div>
                  <h4 className="text-white font-bold uppercase tracking-tight text-sm leading-tight">{cert.title}</h4>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-transparent border-t border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white">{cert.issuer}</div>
                  <ShieldCheck className="w-4 h-4 text-cyan-500" />
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
