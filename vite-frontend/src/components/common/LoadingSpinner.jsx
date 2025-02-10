import { useState, useEffect } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; 
import { motion } from 'framer-motion';

const LoadingSpinner = ({ loading, showSpinner }) => {

    if (showSpinner) {
        return (
            <motion.div
                className="w-8 h-8 m-2"
                animate={{
                    rotate: loading ? 360 : 0,
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                }}
            >
                <ArrowPathIcon className="w-8 h-8" />
            </motion.div>
        );
    }

    return null;
}

export default LoadingSpinner;