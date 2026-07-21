import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-4xl font-mono font-bold text-neon-cyan">
        {hours}:{minutes}:{seconds}
      </div>
      <p className="text-gray-400 text-sm mt-2">{time.toLocaleDateString('en-US', { weekday: 'long' })}</p>
    </motion.div>
  );
};

const AIOrb = ({ assistantName, isPlayingIntro, assistantAvatar }) => {
  return (
    <motion.div
      className="relative w-48 h-48 mx-auto mb-8"
      animate={isPlayingIntro ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-neon-blue/30 blur-md"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, linear: true }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-neon-cyan/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, linear: true }}
      />

      {/* Inner orb */}
      <motion.div
        className="absolute inset-8 rounded-full overflow-hidden border-2 border-neon-blue/50 shadow-xl"
        style={{
          boxShadow: '0 0 40px rgba(0, 212, 255, 0.5), inset 0 0 40px rgba(0, 212, 255, 0.1)',
        }}
        animate={isPlayingIntro ? { boxShadow: ['0 0 40px rgba(0, 212, 255, 0.5)', '0 0 80px rgba(0, 212, 255, 0.8)'] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <img
          src={assistantAvatar}
          alt={assistantName}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-neon-blue rounded-full"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: Math.cos((i / 6) * Math.PI * 2) * 100,
            y: Math.sin((i / 6) * Math.PI * 2) * 100,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: (i / 6) * 0.3,
          }}
        />
      ))}
    </motion.div>
  );
};

export { AnimatedClock, AIOrb };
