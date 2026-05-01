import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, LayoutGrid, ShieldCheck, ChevronRight } from 'lucide-react';
import { MotionText } from '../common/MotionText';
import { Card3D } from '../common/Card3D';
import { DBData } from '../../types';
import { cn } from '../../lib/utils';

interface ExpEduProps {
  dbData: DBData;
}

interface ExpCardProps {
  exp: any;
  idx: number;
}

const ExpCard: React.FC<ExpCardProps> = ({ exp, idx }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card3D 
      className={cn(
        "relative p-6 sm:p-10 border-l-4 border-cyan-500 dark:border-cyan-400 group cursor-pointer transition-all bg-sky-50/20 dark:bg-white/5 backdrop-blur-md shadow-xl",
        isOpen && "ring-1 ring-cyan-500/30"
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em] mb-3">{exp.period}</div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-slate-900 dark:text-white">{exp.position}</h3>
            <div className="text-slate-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">{exp.company}</div>
            <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-medium">
              {exp.description}
            </p>
          </div>
        </div>

        <div className="pt-6 mt-2 border-t border-black/5 dark:border-white/10">
          <button className="text-[10px] font-bold tracking-[0.3em] text-cyan-700 dark:text-cyan-400 uppercase flex items-center gap-2 mb-4 group/btn">
            RESPONSIBILITIES & IMPACT: <ChevronRight className={cn("w-3 h-3 transition-transform duration-300", isOpen ? "rotate-90" : "")} />
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {/* Description moved to main area */}
                {exp.tasks && (
                  <div className="space-y-3">
                     {exp.tasks.map((task: string, tidx: number) => (
                       <div key={tidx} className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-gray-400 font-mono">
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0" />
                          {task}
                       </div>
                     ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card3D>
  );
};

interface EduCardProps {
  edu: any;
  idx: number;
}

const EduCard: React.FC<EduCardProps> = ({ edu, idx }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card3D 
      className={cn(
        "relative p-6 sm:p-10 border-l-4 border-slate-900 dark:border-white group cursor-pointer transition-all bg-slate-50/20 dark:bg-white/5 backdrop-blur-md shadow-xl",
        isOpen && "ring-1 ring-slate-900/30 dark:ring-white/20"
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-[0.2em] mb-3">{edu.year}</div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-slate-900 dark:text-white">{edu.degree}</h3>
            <div className="text-slate-500 dark:text-gray-400 font-bold text-xs uppercase tracking-widest mb-4">{edu.institution}</div>
            <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-medium">
              {edu.description}
            </p>
          </div>
        </div>

        <div className="pt-6 mt-2 border-t border-black/5 dark:border-white/10">
          <button className="text-[10px] font-bold tracking-[0.3em] text-slate-700 dark:text-white uppercase flex items-center gap-2 mb-4 group/btn">
            KEY LEARNING AREAS: <ChevronRight className={cn("w-3 h-3 transition-transform duration-300", isOpen ? "rotate-90" : "")} />
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {/* Description moved to main area */}
                
                {edu.keyPoints && (
                  <div className="space-y-3">
                     <div className="grid grid-cols-1 gap-3">
                       {edu.keyPoints.map((point: string, pidx: number) => (
                         <div key={pidx} className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-gray-400 font-mono italic leading-tight">
                            <span className="text-cyan-500 shrink-0">•</span>
                            {point}
                         </div>
                       ))}
                     </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card3D>
  );
};

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
          <div className="space-y-6">
            {(dbData.experience || []).map((exp, idx) => (
              <ExpCard key={idx} exp={exp} idx={idx} />
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
          <div className="space-y-6">
            {(dbData.education || []).map((edu, idx) => (
              <EduCard key={idx} edu={edu} idx={idx} />
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
