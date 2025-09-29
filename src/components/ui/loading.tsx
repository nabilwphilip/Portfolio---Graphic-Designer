import { motion } from "framer-motion";
import { Palette, Brush, PenTool, Sparkles } from "lucide-react";

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

const Loading = ({ fullScreen = true, text = "Creative Loading..." }: LoadingProps) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden"
    : "flex items-center justify-center p-8";

  return (
    <motion.div
      className={containerClass}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background */}
      {fullScreen && (
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-primary rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-secondary rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
      )}

      <div className="text-center relative z-10">
        {/* Graphic Design themed logo */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1.2,
            type: "spring",
            stiffness: 80 
          }}
        >
          {/* Main circle with gradient */}
          <div className="w-32 h-32 rounded-full bg-gradient-primary shadow-2xl flex items-center justify-center relative overflow-hidden mx-auto">
            {/* Inner design elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear" 
              }}
              className="absolute inset-4 border-2 border-white/30 rounded-full"
            />
            
            {/* Graphic design icons */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "linear" 
              }}
              className="flex items-center justify-center"
            >
              <Palette className="h-8 w-8 text-white" />
            </motion.div>
          </div>

          {/* Orbiting design tools */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "linear" 
            }}
            className="absolute inset-0 w-32 h-32 mx-auto"
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Brush className="h-3 w-3 text-primary" />
              </div>
            </div>
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <PenTool className="h-3 w-3 text-primary" />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Loading text with animation */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-2 mb-6"
        >
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {text}
          </h2>
          <p className="text-white/70 text-lg">
            Crafting your experience...
          </p>
        </motion.div>

        {/* Creative progress indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-3"
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.5, backgroundColor: "rgba(255,255,255,0.3)" }}
              animate={{ 
                scale: [0.5, 1, 0.5],
                backgroundColor: [
                  "rgba(255,255,255,0.3)",
                  "rgba(255,107,107,1)", 
                  "rgba(255,255,255,0.3)"
                ]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: index * 0.15
              }}
              className="w-4 h-4 rounded-full"
            />
          ))}
        </motion.div>

        {/* Floating particles */}
        {fullScreen && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                animate={{
                  x: [0, Math.random() * 400 - 200],
                  y: [0, Math.random() * 400 - 200],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                style={{
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Loading;