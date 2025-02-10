import { useState } from "react";
import { Xmark } from "iconoir-react";
import Profile from "../components/settings/Profile";
import Sessions from "../components/settings/Sessions";

const Settings = ({ isOpen, onClose }) => {

    const [isProfileSelected, setIsProfileSelected] = useState(true);
    const [isSessionSelected, setIsSessionSelected] = useState(false);

    return (
        <section
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
          isOpen ? "block" : "hidden"
        } text-gray-100`}
      >
        <div className="bg-settings w-[90%] md:w-[80%] lg:w-[60%] xl:w-[45%] h-[80%] lg:h-[70%] 2xl:h-[60%] rounded-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center h-[10%] px-4 py-2 border-b border-gray-500">
            <h1 className="text-xl">Settings</h1>
            <button
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex 
              items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white transition duration-500"
            >
              <Xmark className="w-5 h-5" />
            </button>
          </div>
      
          {/* Main Content */}
          <div className="flex flex-1 flex-col lg:flex-row p-4 gap-6 overflow-y-auto">
            {/* Sidebar */}
            <div className="flex flex-row lg:flex-col items-center lg:items-start lg:w-[20%] gap-4 lg:gap-6">
              <button
                className={`${
                  isProfileSelected ? "text-gray-300" : "text-gray-500"
                } text-lg transition duration-500`}
                onClick={() => {
                  setIsProfileSelected(true);
                  setIsSessionSelected(false);
                }}
              >
                Profile
              </button>
              <button
                className={`${
                  isSessionSelected ? "text-gray-300" : "text-gray-500"
                } text-lg transition duration-500`}
                onClick={() => {
                  setIsSessionSelected(true);
                  setIsProfileSelected(false);
                }}
              >
                Sessions
              </button>
            </div>
      
            {/* Content */}
            <div className="flex-1">
              {isProfileSelected && <Profile isProfileSelected={isProfileSelected} />}
              {isSessionSelected && <Sessions isSessionSelected={isSessionSelected} />}
            </div>
          </div>
        </div>
      </section>
      
    );
}

export default Settings;