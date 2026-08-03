import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FULL_TITLE = 'Your Personal AI Assistant';
const INITIALIZING_DOTS = ['.', '..', '...'];
const TOTAL_DURATION = 5000;

const orbitParticles = Array.from({ length: 18 }, (_, index) => {
  const orbitSize = 112 + (index % 4) * 18;

  return {
    id: index,
    size: 4 + (index % 3),
    orbitSize,
    angle: (index * 360) / 18,
    duration: 9 + (index % 5) * 1.7,
    delay: (index % 6) * 0.18,
    blur: index % 2 === 0 ? '1px' : '0px',
  };
});

const backgroundParticles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 11) % 100}%`,
  top: `${(index * 23 + 7) % 100}%`,
  size: 2 + (index % 2),
  duration: 8 + (index % 6),
  delay: (index % 8) * 0.35,
}));

const stageVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(10px)',
    transition: { duration: 0.45, ease: 'easeInOut' },
  },
};

function SplashScreen() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [dotsIndex, setDotsIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    let frameId = 0;

    const animateProgress = (now) => {
      const elapsed = now - startTime;
      const value = Math.min(100, (elapsed / TOTAL_DURATION) * 100);

      setProgress(value);

      if (elapsed < TOTAL_DURATION) {
        frameId = requestAnimationFrame(animateProgress);
      }
    };

    frameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 700),
      window.setTimeout(() => setPhase(2), 1500),
      window.setTimeout(() => setPhase(3), 3050),
      window.setTimeout(() => setIsExiting(true), 4550),
      window.setTimeout(() => navigate('/login', { replace: true }), TOTAL_DURATION),
    ];

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [navigate]);

  useEffect(() => {
    if (phase !== 2) {
      setTypedText('');
      return undefined;
    }

    let currentIndex = 0;
    const typeInterval = window.setInterval(() => {
      currentIndex += 1;
      setTypedText(FULL_TITLE.slice(0, currentIndex));

      if (currentIndex >= FULL_TITLE.length) {
        clearInterval(typeInterval);
      }
    }, 45);

    return () => clearInterval(typeInterval);
  }, [phase]);

  useEffect(() => {
    if (phase < 3) {
      setDotsIndex(0);
      return undefined;
    }

    const dotsInterval = window.setInterval(() => {
      setDotsIndex((current) => (current + 1) % INITIALIZING_DOTS.length);
    }, 360);

    return () => clearInterval(dotsInterval);
  }, [phase]);

  const visibleDots = INITIALIZING_DOTS[dotsIndex];

  return (
    <motion.section
      className="fixed inset-0 z-50 overflow-hidden bg-[#050816] text-white"
      initial={{ opacity: 1 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_28%),linear-gradient(135deg,rgba(5,8,22,0.96),rgba(5,8,22,0.88))]"
          animate={prefersReducedMotion ? undefined : { opacity: [0.82, 1, 0.82] }}
          transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          aria-hidden="true"
          className="absolute inset-0 opacity-60 mix-blend-screen"
          style={{
            backgroundImage:
              'linear-gradient(115deg, transparent 34%, rgba(34,211,238,0.08) 48%, transparent 62%), linear-gradient(65deg, transparent 42%, rgba(59,130,246,0.06) 50%, transparent 58%)',
            backgroundSize: '100% 100%, 100% 100%',
          }}
          animate={prefersReducedMotion ? undefined : { rotate: [0, 4, 0], scale: [1, 1.03, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="absolute inset-0 opacity-18">
          <div className="jarvis-scanlines absolute inset-0" />
        </div>

        <div className="absolute inset-0 overflow-hidden">
          {backgroundParticles.map((particle) => (
            <motion.span
              key={particle.id}
              aria-hidden="true"
              className="absolute rounded-full bg-cyan-200/80 shadow-[0_0_10px_rgba(34,211,238,0.7)]"
              style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
              animate={prefersReducedMotion ? { opacity: 0.3 } : {
                opacity: [0.12, 0.7, 0.12],
                x: [0, particle.id % 2 === 0 ? 18 : -18, 0],
                y: [0, particle.id % 3 === 0 ? -14 : 14, 0],
                scale: [1, 1.3, 1],
              }}
              transition={prefersReducedMotion ? { duration: 0 } : {
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative flex w-full max-w-3xl flex-col items-center justify-center text-center">
          <div className="relative flex h-[420px] w-full items-center justify-center sm:h-[480px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                aria-hidden="true"
                className="absolute h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-3xl sm:h-[30rem] sm:w-[30rem]"
                animate={prefersReducedMotion ? undefined : { scale: [0.92, 1.04, 0.92], opacity: [0.45, 0.8, 0.45] }}
                transition={prefersReducedMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.div
                aria-hidden="true"
                className="absolute h-[18rem] w-[18rem] rounded-full border border-cyan-300/20 bg-[radial-gradient(circle,rgba(34,211,238,0.11),rgba(5,8,22,0.02)_70%,transparent_82%)] shadow-[0_0_80px_rgba(34,211,238,0.18)] sm:h-[22rem] sm:w-[22rem]"
                animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1], opacity: [0.85, 1, 0.85] }}
                transition={prefersReducedMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.div
                aria-hidden="true"
                className="absolute h-[16rem] w-[16rem] rounded-full border border-cyan-200/35 shadow-[0_0_30px_rgba(34,211,238,0.18),inset_0_0_24px_rgba(34,211,238,0.16)] sm:h-[20rem] sm:w-[20rem]"
                animate={prefersReducedMotion ? { rotate: 0 } : { rotate: 360 }}
                transition={prefersReducedMotion ? undefined : { duration: 24, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute left-1/2 top-0 h-5 w-1 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.95)]" />
                <div className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-blue-300 shadow-[0_0_16px_rgba(96,165,250,0.9)]" />
                <div className="absolute bottom-4 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.95)]" />
              </motion.div>

              <motion.div
                aria-hidden="true"
                className="absolute h-[12rem] w-[12rem] rounded-full border border-cyan-200/45 border-t-transparent border-r-transparent shadow-[0_0_24px_rgba(34,211,238,0.18)] sm:h-[15rem] sm:w-[15rem]"
                animate={prefersReducedMotion ? { rotate: 0 } : { rotate: -360 }}
                transition={prefersReducedMotion ? undefined : { duration: 18, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute left-1/2 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-100 shadow-[0_0_14px_rgba(255,255,255,0.95)]" />
                <div className="absolute right-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.85)]" />
              </motion.div>

              <motion.div
                aria-hidden="true"
                className="absolute h-[8rem] w-[8rem] rounded-full border border-blue-200/40 border-b-transparent border-l-transparent shadow-[0_0_18px_rgba(96,165,250,0.2)] sm:h-[10.5rem] sm:w-[10.5rem]"
                animate={prefersReducedMotion ? { rotate: 0 } : { rotate: 360 }}
                transition={prefersReducedMotion ? undefined : { duration: 11, repeat: Infinity, ease: 'linear' }}
              />

              <div className="absolute h-[5.75rem] w-[5.75rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.96),rgba(103,232,249,0.92)_22%,rgba(34,211,238,0.74)_52%,rgba(8,15,39,0.02)_76%)] shadow-[0_0_28px_rgba(34,211,238,0.5),0_0_92px_rgba(59,130,246,0.24),inset_0_0_20px_rgba(255,255,255,0.45)] sm:h-[7.5rem] sm:w-[7.5rem]">
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-2 rounded-full border border-white/20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.72),rgba(34,211,238,0.38)_42%,rgba(5,8,22,0.08)_78%)]"
                  animate={prefersReducedMotion ? undefined : { scale: [0.92, 1.04, 0.92], opacity: [0.75, 1, 0.75] }}
                  transition={prefersReducedMotion ? undefined : { duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-[-0.8rem] rounded-full border border-cyan-300/30"
                  animate={prefersReducedMotion ? undefined : { scale: [0.86, 1.08, 0.86], opacity: [0.2, 0.75, 0.2] }}
                  transition={prefersReducedMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              {orbitParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 rounded-full bg-cyan-100 shadow-[0_0_14px_rgba(255,255,255,0.95)]"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    filter: particle.blur,
                    marginLeft: -particle.size / 2,
                    marginTop: -particle.size / 2,
                  }}
                  animate={prefersReducedMotion ? undefined : {
                    rotate: 360,
                    x: [particle.orbitSize, particle.orbitSize, particle.orbitSize],
                    y: [0, 0, 0],
                    opacity: [0.18, 0.95, 0.18],
                    scale: [0.9, 1.12, 0.9],
                  }}
                  transition={prefersReducedMotion ? undefined : {
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              ))}

              <motion.div
                aria-hidden="true"
                className="absolute h-[9.5rem] w-[9.5rem] rounded-full border border-cyan-200/15 bg-[conic-gradient(from_0deg,transparent_0_18%,rgba(34,211,238,0.7)_18%_20%,transparent_20%_44%,rgba(96,165,250,0.55)_44%_46%,transparent_46%_72%,rgba(34,211,238,0.72)_72%_74%,transparent_74%_100%)] blur-[1px] sm:h-[12rem] sm:w-[12rem]"
                animate={prefersReducedMotion ? { rotate: 0 } : { rotate: 360 }}
                transition={prefersReducedMotion ? undefined : { duration: 15, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>

          <div className="relative z-10 mt-2 flex min-h-[12rem] w-full max-w-2xl flex-col items-center justify-start px-2 sm:min-h-[13rem]">
            <AnimatePresence mode="wait" initial={false}>
              {phase === 0 && (
                <motion.div
                  key="welcome"
                  variants={stageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center gap-3"
                >
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.55em] text-cyan-100/80 sm:text-[0.8rem]">
                    WELCOME TO
                  </p>
                  <p className="bg-gradient-to-r from-cyan-100 via-cyan-300 to-blue-300 bg-clip-text text-5xl font-semibold tracking-[0.28em] text-transparent drop-shadow-[0_0_18px_rgba(34,211,238,0.8)] sm:text-6xl">
                    JARVIS
                  </p>
                </motion.div>
              )}

              {phase === 1 && (
                <motion.div
                  key="jarvis"
                  variants={stageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center gap-3"
                >
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.55em] text-cyan-100/65 sm:text-[0.8rem]">
                    WELCOME TO
                  </p>
                  <p className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-5xl font-semibold tracking-[0.26em] text-transparent drop-shadow-[0_0_22px_rgba(255,255,255,0.45),0_0_22px_rgba(34,211,238,0.8)] sm:text-6xl">
                    JARVIS
                  </p>
                </motion.div>
              )}

              {phase === 2 && (
                <motion.div
                  key="tagline"
                  variants={stageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center gap-5"
                >
                  <p className="text-[0.72rem] font-medium uppercase tracking-[0.52em] text-cyan-100/70 sm:text-[0.8rem]">
                    WELCOME TO
                  </p>
                  <p className="bg-gradient-to-r from-cyan-100 via-white to-blue-200 bg-clip-text text-5xl font-semibold tracking-[0.26em] text-transparent drop-shadow-[0_0_18px_rgba(34,211,238,0.9)] sm:text-6xl">
                    JARVIS
                  </p>
                  <motion.p
                    className="min-h-[2rem] text-base font-medium tracking-[0.16em] text-cyan-50/90 sm:text-lg"
                    animate={prefersReducedMotion ? undefined : { opacity: [0.75, 1, 0.75] }}
                    transition={prefersReducedMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {typedText}
                    <span className="ml-1 inline-block text-cyan-300">|</span>
                  </motion.p>
                </motion.div>
              )}

              {phase >= 3 && (
                <motion.div
                  key="initializing"
                  variants={stageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex w-full flex-col items-center gap-5"
                >
                  <p className="bg-gradient-to-r from-cyan-100 via-white to-blue-200 bg-clip-text text-4xl font-semibold tracking-[0.18em] text-transparent drop-shadow-[0_0_18px_rgba(34,211,238,0.85)] sm:text-5xl">
                    JARVIS
                  </p>
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.5em] text-cyan-100/70 sm:text-[0.82rem]">
                    <span>Your Personal AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium tracking-[0.28em] text-cyan-50/80 sm:text-base">
                    <span>Initializing Neural Core</span>
                    <motion.span
                      key={visibleDots}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="w-8 text-left text-cyan-300"
                    >
                      {visibleDots}
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 w-full max-w-md px-2 sm:mt-10">
              <div className="mb-3 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.45em] text-cyan-100/60 sm:text-[0.7rem]">
                <span>Neural Boot Sequence</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full border border-cyan-300/15 bg-white/5 shadow-[0_0_30px_rgba(34,211,238,0.08),inset_0_0_14px_rgba(34,211,238,0.12)]">
                <motion.div
                  className="h-full origin-left rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.95),rgba(103,232,249,0.95),rgba(34,211,238,0.95),rgba(59,130,246,0.95))] shadow-[0_0_18px_rgba(34,211,238,0.8)]"
                  style={{ transformOrigin: '0% 50%' }}
                  animate={{ scaleX: progress / 100 }}
                  transition={{ duration: 0, ease: 'linear' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default SplashScreen;