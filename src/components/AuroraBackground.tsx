import { motion } from 'framer-motion';

export const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#030014]">
      {/* Orb 1: Indigo */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-indigo-600 rounded-full blur-[120px] opacity-40 mix-blend-screen"
      />

      {/* Orb 2: Violet */}
      <motion.div
        animate={{
          x: [0, -70, 30, 0],
          y: [0, 60, -40, 0],
          scale: [1, 1.1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vh] bg-violet-600 rounded-full blur-[100px] opacity-30 mix-blend-screen"
      />

      {/* Orb 3: Cyan */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[40vh] bg-cyan-600 rounded-full blur-[130px] opacity-30 mix-blend-screen"
      />
      
      {/* Grid overlay for texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
    </div>
  );
};
