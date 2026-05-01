import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { cn } from '../../lib/utils';

export function Card3D({ children, className, glow, onClick }: { children: React.ReactNode, className?: string, glow?: boolean, onClick?: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isTouchDevice) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 12;
    const rotateY = (centerX - x) / 12;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <div 
      className={cn("perspective-1200 group", onClick && "cursor-pointer")}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
        <div
          ref={cardRef}
          className={cn(
            "relative w-full h-full transform-style-3d transition-all duration-300",
            "glass-panel overflow-hidden",
            glow && "neon-glow",
            "shadow-[20px_40px_80px_-15px_rgba(15,23,42,0.15)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]",
            className
          )}
        >
        {children}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </div>
  );
}
