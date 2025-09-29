import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";

interface WhatsAppCTAProps {
  phoneNumber?: string;
  message?: string;
}

const WhatsAppCTA = ({ 
  phoneNumber = "+20 103 301 3469", 
  message = "Hi! I'm interested in your design services." 
}: WhatsAppCTAProps) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay: 2,
        type: "spring",
        stiffness: 260,
        damping: 20 
      }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        onClick={handleWhatsAppClick}
        className="group relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:shadow-green-500/25"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(34, 197, 94, 0.3)",
            "0 0 30px rgba(34, 197, 94, 0.6)",
            "0 0 20px rgba(34, 197, 94, 0.3)"
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-green-400 rounded-full opacity-75 group-hover:opacity-100 blur-lg transition-opacity duration-300"></div>
        
        {/* Icon container */}
        <div className="relative z-10 flex items-center justify-center">
          <MessageCircle className="h-6 w-6" />
          
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 border-2 border-green-300 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat with us on WhatsApp
          <div className="text-xs text-gray-300 mt-1">{phoneNumber}</div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      </motion.button>

      {/* Floating particles around the button */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            animate={{
              x: [0, Math.random() * 60 - 30],
              y: [0, Math.random() * 60 - 30],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: "50%",
              top: "50%",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default WhatsAppCTA;