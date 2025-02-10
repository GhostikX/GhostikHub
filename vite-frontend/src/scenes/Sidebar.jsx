import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Notes, OpenBook, ViewGrid, User, TransitionLeft, FloppyDisk, Menu } from 'iconoir-react';
import { motion, AnimatePresence } from 'framer-motion';
import { performLogout } from '../services/session-client';
import Settings from './Settings';
import { toastStatus } from '../utils/toastStatus';
import Toast from '../components/common/Toast';
import useMediaQuery from '../hooks/useMediaQuery';
import ghostImage from "/ghost.png";

const Sidebar = ({ isNoteSidebar, setIsAuthenticated, handleSaveNote, handleLeaveNote }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isAboveSmallScreens = useMediaQuery("(min-width: 640px)");

  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [toast, setToast] = useState({ message: '', status: '', isOpen: false });
  const showToast = (message, status) => {
      setToast({ message, status, isOpen: true });
      setTimeout(() => setToast({ ...toast, isOpen: false }), 3000);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    performLogout().then(res => {
      setIsAuthenticated(false);
      navigate("/dashboard");
    }).catch(() => {
      showToast("Something went wrong. Please try again.", toastStatus.FAILED);
    })
  }

  return (
    <section className="relative">
      <Toast 
          message={toast.message}
          status={toast.status}
          isOpen={toast.isOpen}
          onClose={() => setToast({ ...toast, isOpen: false })}
      />
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      {/* Mobile Menu Button */}
      {!isAboveSmallScreens && (
        <button
          className={`p-4 text-white fixed ${isNoteSidebar ? 'right-2' : 'left-4 '} z-30`}
          onClick={toggleSidebar}
        >
          <Menu className="w-8 h-8" />
        </button>
      )}
      
      {/* Sidebar */}
      <AnimatePresence>
        {(isAboveSmallScreens || isSidebarOpen) && (
          <motion.div
            className={`
              ${isNoteSidebar ? "bg-[#101011]" : "bg-sidebar border-gray-700 border-opacity-60 border-r"} 
              ${isNoteSidebar && !isAboveSmallScreens ? 'right-0 bg-opacity-20' : 'left-0'}
              fixed top-0  h-screen w-20 flex flex-col items-center pt-6 z-20`}
            initial={{ x: isNoteSidebar && !isAboveSmallScreens ? 300 : (isAboveSmallScreens ? 0 : -300) }}
            animate={{ x: 0 }}
            exit={{ x: isNoteSidebar ? 300 : -300 }}
            transition={{ duration: 0.3 }}
          >
            {/* Sidebar Content */}
            <div>
              <div className={`w-10 h-10 font-bold mx-auto ${!isAboveSmallScreens && 'mt-10'}`}>
                <img src={ghostImage} alt='ghost-image' />
              </div>
              {isNoteSidebar && (
                <div className="pb-5 space-y-3">
                  <div className="items-center px-1">
                    <button
                      className="p-2 hover:text-white transition duration-500"
                      onClick={handleSaveNote}
                    >
                      <FloppyDisk className="w-7 h-7" />
                    </button>
                    <button
                      className="p-2 hover:text-white transition duration-500 pb-3"
                      onClick={() => handleLeaveNote("notes")}
                    >
                      <TransitionLeft className="w-7 h-7" />
                    </button>
                  </div>
                  <hr className="border-gray-400 w-24" />
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <ul className="text-center space-y-4 flex-grow pt-5">
              {["dashboard", "notes", "calendar", "targets"].map((page) => (
                <li key={page}>
                  <Link to={`/${page}`} title={page.charAt(0).toUpperCase() + page.slice(1)}>
                    <div className="bg-slate-700 bg-opacity-50 rounded-full p-2">
                      {page === "dashboard" && (
                        <ViewGrid className="w-8 h-8 m-auto hover:text-white transition duration-500" />
                      )}
                      {page === "notes" && (
                        <Notes className="w-8 h-8 m-auto hover:text-white transition duration-500" />
                      )}
                      {page === "calendar" && (
                        <Calendar className="w-8 h-8 m-auto hover:text-white transition duration-500" />
                      )}
                      {page === "targets" && (
                        <OpenBook className="w-8 h-8 m-auto hover:text-white transition duration-500" />
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* User Dropdown */}
            <div className="mx-auto pb-3 relative">
              <button
                className="bg-slate-700 bg-opacity-50 rounded-full p-2"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <User className="w-8 h-8 m-auto hover:text-white transition duration-500" />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    ref={dropdownRef}
                    className={`absolute bottom-12 w-48 bg-gray-700 rounded-lg shadow-lg ${isNoteSidebar && !isAboveSmallScreens ? "right-5" : ''}`}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <ul className="text-white p-2">
                      <li
                        className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                        onClick={() => setIsSettingsOpen(true)}
                      >
                        Settings
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Sidebar;
