export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export const rotateIn = {
  hidden: { opacity: 0, rotate: -180 },
  visible: { opacity: 1, rotate: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  boxShadow: [
    '0 0 0 0 rgba(0, 212, 255, 0.7)',
    '0 0 0 20px rgba(0, 212, 255, 0)',
  ],
  transition: { duration: 1.5, repeat: Infinity },
};

export const floatingAnimation = {
  y: [0, -20, 0],
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
};

export const glowAnimation = {
  boxShadow: [
    '0 0 10px rgba(0, 212, 255, 0.3)',
    '0 0 30px rgba(0, 212, 255, 0.8)',
    '0 0 10px rgba(0, 212, 255, 0.3)',
  ],
  transition: { duration: 2, repeat: Infinity },
};
