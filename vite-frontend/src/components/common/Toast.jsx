import { motion, AnimatePresence  } from "framer-motion";
import { CheckCircle, XmarkCircle } from "iconoir-react";
import { toastStatus } from "../../utils/toastStatus";

const Toast = ({ message, status, isOpen, onClose }) => {

  const icon = status === toastStatus.SUCCESS ? (
    <CheckCircle className="text-green-600 w-7 h-7" />
  ) : (
    <XmarkCircle className="text-red-600 text-opacity-80 w-7 h-7" />
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`
            fixed top-5 left-[40%] transform -translate-x-1/2 p-4 rounded-lg text-white bg-toast
            w-auto sm:w-[90%] md:w-[60%] lg:w-[40%] xl:w-[30%]
            max-w-xs sm:max-w-sm md:max-w-md
            z-50
            `
          }
        >
          <div className="flex justify-between items-center flex-row">
            <span className="">{message}</span>
            {icon}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
