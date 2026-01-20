import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { AuroraBackground } from "./AuroraBackground";

export const AccessGate = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      <AuroraBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 relative flex flex-col items-center gap-8"
      >
        <div className="text-center space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          >
            SHADOW OS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-indigo-200 tracking-[0.2em] font-light uppercase"
          >
            Decentralized Workspace Kernel
          </motion.p>
        </div>

        <div className="p-[1px] rounded-xl bg-gradient-to-br from-white/20 via-white/5 to-transparent backdrop-blur-xl">
          <div className="bg-black/40 rounded-xl p-8 border border-white/10 shadow-2xl">
            <SignIn 
                appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "bg-transparent shadow-none w-full",
                        headerTitle: "text-white hidden",
                        headerSubtitle: "text-gray-400 hidden",
                        socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-white",
                        socialButtonsBlockButtonText: "text-white font-mono",
                        dividerLine: "bg-white/10",
                        dividerText: "text-white/40",
                        formFieldLabel: "text-white/70",
                        formFieldInput: "bg-black/50 border-white/10 text-white focus:border-indigo-500",
                        footerActionLink: "text-indigo-400 hover:text-indigo-300",
                        formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]",
                        
                    }
                }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
