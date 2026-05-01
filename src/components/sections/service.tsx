import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, PenTool, Share2, Layers, Cpu, Monitor, Music } from 'lucide-react';
import { MotionText } from '../common/MotionText';
import { Card3D } from '../common/Card3D';
import { DBData } from '../../types';
import { cn } from '../../lib/utils';

interface ServiceProps {
  dbData: DBData;
}

interface ServiceCardProps {
  idx: number;
  service: any;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ idx, service }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icons = [PenTool, Share2, Layers, Cpu, Monitor, Music];
  const Icon = Icons[idx % Icons.length];
  
  const variations = [
    "bg-blue-50/30 border-blue-100/50 dark:bg-white/5",
    "bg-cyan-50/30 border-cyan-100/50 dark:bg-white/5",
    "bg-indigo-50/30 border-indigo-100/50 dark:bg-white/5",
    "bg-slate-50/30 border-slate-100/50 dark:bg-white/5",
    "bg-sky-50/30 border-sky-100/50 dark:bg-white/5",
    "bg-violet-50/30 border-violet-100/50 dark:bg-white/5"
  ];
  const iconColors = [
    "bg-blue-100 text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-400",
    "bg-cyan-100 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400",
    "bg-indigo-100 text-indigo-600 dark:bg-cyan-400/10 dark:text-cyan-400",
    "bg-slate-200 text-slate-700 dark:bg-cyan-400/10 dark:text-cyan-400",
    "bg-sky-100 text-sky-600 dark:bg-cyan-400/10 dark:text-cyan-400",
    "bg-violet-100 text-violet-600 dark:bg-cyan-400/10 dark:text-cyan-400"
  ];

  return (
    <Card3D 
      className={cn(
        "group p-6 sm:p-10 flex flex-col gap-6 transition-all h-full relative",
        variations[idx % variations.length],
        isOpen ? "ring-1 ring-cyan-500/30" : ""
      )} 
      glow={isOpen}
      onClick={() => setIsOpen(!isOpen)}
    >
      {service.image && (
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity duration-700">
          <img src={service.image} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
        </div>
      )}
      
      <div className="relative z-10">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all", iconColors[idx % iconColors.length])}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-2 text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors uppercase">{service.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 font-mono">{service.focus}</p>
        <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-6 font-medium">{service.desc}</p>
        
        <div className="pt-6 border-t border-black/5 dark:border-white/10">
          <button className="text-[10px] font-bold tracking-[0.3em] text-cyan-700 dark:text-cyan-400 uppercase flex items-center gap-2 mb-2 group/btn">
            FOCUS AREAS: <ChevronRight className={cn("w-3 h-3 transition-transform", isOpen ? "rotate-90" : "")} />
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-3">
                  {(service.offerings || []).map((point: string, pIdx: number) => (
                    <div key={pIdx} className="text-sm text-slate-600 dark:text-slate-200 leading-relaxed font-medium flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                      {point}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card3D>
  );
};

export const Service: React.FC<ServiceProps> = ({ dbData }) => {
  return (
    <motion.section
      key="services"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-16"
    >
      <div className="text-center space-y-4">
        <MotionText delay={0.1}>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">My Services</h2>
        </MotionText>
        <MotionText delay={0.2}>
          <p className="text-slate-500 dark:text-white max-w-xl mx-auto">Luxury design solutions tailored for your brand.</p>
        </MotionText>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {(dbData.services || []).map((service, idx) => (
          <ServiceCard key={idx} idx={idx} service={service} />
        ))}
      </div>
    </motion.section>
  );
};
