import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ModalLeavePage = ({ isOpen, setIsOpen, handleSaveSnapshot, pageName }) => {
    const navigate = useNavigate();

    return (
        isOpen && (
            <AnimatePresence>
                <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-70 z-40"
                >
                    <div 
                        className="bg-gray-700 bg-opacity-80 p-4 rounded-lg w-96"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-lg font-semibold">Confirmation</h2>
                            <button 
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex 
                                                items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white transition duration-500"
                                onClick={() => setIsOpen(false)}
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <hr className="border-gray-500"/>

                        <div className="relative my-2 text-slate-200">
                            <p>You are about to leave this note without saving. All changes will be lost. Do you really want to leave without saving?</p>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button 
                                className="px-4 py-2 bg-gray-700 bg-opacity-40 text-gray-200 rounded-md transition duration-500 hover:bg-gray-600 focus:outline-none"
                                onClick={() => 
                                    {
                                        handleSaveSnapshot()
                                        setIsOpen(false)
                                        setTimeout(() => navigate(`/${pageName}`), 100);
                                    }
                                }
                            >
                                Save Note
                            </button>
                            <button 
                                className="px-4 py-2 bg-gray-700 bg-opacity-40 text-gray-200 rounded-md transition duration-500 hover:bg-gray-600 focus:outline-none"
                                onClick={() => 
                                    {
                                        setIsOpen(false);
                                        setTimeout(() => navigate(`/${pageName}`), 100);
                                    }
                                }
                            >
                                Leave Page
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        )
)
}
export default ModalLeavePage;