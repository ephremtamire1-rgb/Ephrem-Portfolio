import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone } from 'lucide-react';
import { MotionText } from '../common/MotionText';
import { Card3D } from '../common/Card3D';
import { DBData } from '../../types';

interface ContactProps {
  dbData: DBData;
  setChatOpen: (open: boolean) => void;
}

export const Contact: React.FC<ContactProps> = ({ dbData, setChatOpen }) => {
  return (
    <motion.section
      key="contact"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
    >
      <div className="space-y-8">
        <MotionText delay={0.1}>
          <h2 className="text-5xl font-black uppercase tracking-tighter leading-none text-slate-900 dark:text-white">Let's Create<br />Something<br /><span className="text-cyan-400">Epic.</span></h2>
        </MotionText>
        
        <MotionText delay={0.2} className="relative w-full rounded-3xl overflow-hidden glass-panel border border-white/10 mb-8 shadow-2xl p-2">
          <motion.img 
            initial={{ filter: "grayscale(100%)", opacity: 0.7 }}
            whileHover={{ 
              scale: 1.05,
              filter: "grayscale(0%)",
              opacity: 1
            }}
            transition={{ duration: 0.8, ease: "circOut" }}
            src="https://lh3.googleusercontent.com/d/1ojjP96iF4Jmvy-SBv4XE15JQF28fV_JV" 
            className="w-full h-auto cursor-pointer rounded-2xl object-contain transition-all duration-1000" 
            alt="Contact Landscape" 
          />
        </MotionText>

        <MotionText delay={0.3}>
          <p className="text-slate-600 dark:text-white leading-relaxed font-light">Available for new projects and collaborations. Drop me a line and let's turn your vision into 3D reality.</p>
        </MotionText>

        <div className="space-y-6">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors"><Mail className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /></div>
            <div className="text-sm font-bold tracking-widest uppercase dark:text-white">ephremtamire1@gmail.com</div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors"><Phone className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /></div>
            <div className="text-sm font-bold tracking-widest uppercase flex flex-col dark:text-white">
               <span>+251 916 771 788</span>
               <span className="opacity-50">+251 916 314 599</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          {[
            { logo: "https://www.vectorlogo.zone/logos/instagram/instagram-icon.svg", link: dbData.user?.socials?.instagram, label: "Instagram" },
            { logo: "https://www.vectorlogo.zone/logos/whatsapp/whatsapp-icon.svg", link: dbData.user?.socials?.whatsapp, label: "WhatsApp" },
            { logo: "https://www.vectorlogo.zone/logos/facebook/facebook-official.svg", link: dbData.user?.socials?.facebook, label: "Facebook" },
            { logo: "https://www.vectorlogo.zone/logos/linkedin/linkedin-icon.svg", link: dbData.user?.socials?.linkedin, label: "LinkedIn" },
            { logo: "https://www.vectorlogo.zone/logos/tiktok/tiktok-icon.svg", link: dbData.user?.socials?.tiktok, label: "TikTok" },
          ].map((s, i) => (
            <a 
              key={i} 
              href={s.link} 
              target="_blank" 
              rel="noreferrer" 
              className="w-10 h-10 glass-panel rounded-xl flex items-center justify-center hover:bg-white dark:hover:bg-white transition-all hover:-translate-y-1 p-2"
              title={s.label}
            >
              <img src={s.logo} alt={s.label} className="w-full h-full object-contain" />
            </a>
          ))}
        </div>
      </div>
      <div>
        <Card3D className="p-6 sm:p-10" glow>
           <form 
             className="space-y-6"
             onSubmit={async (e) => {
               e.preventDefault();
               const target = e.target as any;
               const msg = {
                 sender: target.name.value,
                 email: target.email.value,
                 text: target.vision.value,
                 isAdmin: false
               };
               await fetch('/api/messages', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(msg)
               });
               setChatOpen(true);
               target.reset();
             }}
           >
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-white">Full Name</label>
                <input name="name" required className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-white">Email Address</label>
                <input name="email" type="email" required className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-white">Your Vision</label>
                <textarea name="vision" required className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-5 py-4 text-sm outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors h-32" placeholder="Tell me about your project..." />
              </div>
              <button type="submit" className="w-full py-4 bg-cyan-500 text-white dark:text-black font-black uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">SEND MESSAGE</button>
           </form>
        </Card3D>
      </div>
    </motion.section>
  );
};
