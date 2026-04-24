import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { MotionText } from '../common/MotionText';
import { Card3D } from '../common/Card3D';
import { DBData } from '../../types';
import { cn } from '../../lib/utils';

interface MyWorkProps {
  dbData: DBData;
  portfolioFilter: string;
  setPortfolioFilter: (filter: string) => void;
}

export const MyWork: React.FC<MyWorkProps> = ({ dbData, portfolioFilter, setPortfolioFilter }) => {
  return (
    <motion.section
      key="portfolio"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-16"
    >
       <div className="text-center space-y-4">
        <MotionText delay={0.1}>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">My Works</h2>
        </MotionText>
        <MotionText delay={0.2} className="flex flex-wrap gap-4 justify-center">
           {['All', 'Branding', 'Motion', 'Graphics', '3D'].map(cat => (
             <button 
               key={cat}
               onClick={() => setPortfolioFilter(cat)}
               className={cn(
                 "px-6 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all cursor-pointer border",
                 portfolioFilter === cat ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-black shadow-xl" : "bg-transparent border-slate-900/10 text-slate-500 dark:border-white/10 dark:text-white hover:border-slate-900 dark:hover:border-white shadow-sm"
               )}
             >
               {cat}
             </button>
           ))}
        </MotionText>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {(dbData.projects || [])
          .filter(p => portfolioFilter === 'All' || p.category === portfolioFilter)
          .map((project) => (
            <div key={project.id} className="group cursor-pointer">
              <Card3D className="min-h-[480px] h-auto flex flex-col group/card" glow>
                <div className="h-48 sm:h-64 overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-60 dark:opacity-40 group-hover:opacity-100 dark:group-hover:opacity-80 transition-all duration-1000 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black/80 via-transparent to-transparent opacity-80 dark:opacity-100" />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-between relative z-10 bg-white/40 dark:bg-transparent backdrop-blur-sm dark:backdrop-blur-none">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-[9px] tracking-[0.2em] font-bold text-cyan-700 dark:text-cyan-400 uppercase mb-4">
                      {project.category}
                    </span>
                    <h3 className="text-3xl font-black mb-3 tracking-tighter uppercase leading-tight text-slate-900 dark:text-white group-hover/card:text-cyan-600 dark:group-hover/card:text-cyan-400 transition-colors">{project.title}</h3>
                    <p className="text-slate-600 dark:text-white text-sm leading-relaxed line-clamp-2 font-light">
                      {project.description}
                    </p>
                  </div>
                  <div className="pt-6">
                     <a 
                       href={`#${project.id}`}
                       className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-cyan-400 group-hover:gap-4 transition-all"
                     >
                       View Case Study <ExternalLink className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                     </a>
                  </div>
                </div>
              </Card3D>
            </div>
          ))}
      </div>
    </motion.section>
  );
};
