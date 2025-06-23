import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setPosition(newPosition);
      
      setTrail(prev => [...prev.slice(-10), newPosition]);
      
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <>
      {trail.map((pos, index) => (
        <motion.div
          key={index}
          className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-50 mix-blend-difference"
          initial={{ opacity: 0.1 }}
          animate={{
            x: pos.x - 12,
            y: pos.y - 12,
            opacity: index === trail.length - 1 ? 0.5 : 0.1,
          }}
          transition={{ duration: 0.1 }}
        >
          <div className="w-full h-full bg-white rounded-full blur-sm" />
        </motion.div>
      ))}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="w-full h-full bg-white rounded-full" />
      </motion.div>
    </>
  );
};