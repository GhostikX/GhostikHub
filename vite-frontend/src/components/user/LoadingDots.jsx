import { motion } from "framer-motion";

const LoadingDots = () => {
    return (
      <div className="flex justify-center items-center space-x-2">
        <motion.div
          className="w-2.5 h-2.5 bg-gray-400 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{
            repeat: Infinity,
            repeatDelay: 0.3,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="w-2.5 h-2.5 bg-gray-400 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{
            repeat: Infinity,
            repeatDelay: 0.3,
            duration: 1.5,
            ease: "easeInOut",
            delay: 0.3, // Delay for the second dot
          }}
        />
        <motion.div
          className="w-2.5 h-2.5 bg-gray-400 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{
            repeat: Infinity,
            repeatDelay: 0.3,
            duration: 1.5,
            ease: "easeInOut",
            delay: 0.6, // Delay for the third dot
          }}
        />
      </div>
    );
  };

  export default LoadingDots;