import { motion } from 'motion/react';

export const MotionText = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
