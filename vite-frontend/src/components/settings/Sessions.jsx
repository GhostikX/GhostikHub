import { useEffect, useState } from "react";
import { getUserSessions } from "../../services/session-client";
import parseUserAgent from "../../utils/userAgentParser";
import dayjs from "dayjs";
import { deactivateSession } from "../../services/session-client";
import Toast from "../common/Toast";

const Sessions = ({ isSessionSelected }) => {
    if (!isSessionSelected) return;

    const [activeSessionData, setActiveSessionData] = useState([]);
    const [currentSession, setCurrentSessionData] = useState([]);

    const [toast, setToast] = useState({ message: '', status: '', isOpen: false });
    const showToast = (message, status) => {
        setToast({ message, status, isOpen: true });
        setTimeout(() => setToast({ ...toast, isOpen: false }), 3000);
    };

    const handleDeactivation = (id) => {
        const sessionId = id;

        deactivateSession(sessionId).then(res => {
            fetchSessions();
        }).catch(() => {
            showToast("Something went wrong. Please try again.", toastStatus.FAILED);
        })
    }

    const fetchSessions = async () => {
        getUserSessions().then(res => {
            const updatedActiveSessions = res.data.activeSession.map(session => ({
                ...session,
                lastAccessedTime: new Date(session.lastAccessedTime).toLocaleString(),
                device: parseUserAgent(session.device)
            }));
            const updatedCurrentSession = res.data.currentSession.map(session => ({
                ...session,
                lastAccessedTime: new Date(session.lastAccessedTime).toLocaleString(),
                device: parseUserAgent(session.device)
            }));
            setActiveSessionData(updatedActiveSessions);
            setCurrentSessionData(updatedCurrentSession);
        }).catch(() => {
            showToast("Something went wrong. Please try again.", toastStatus.FAILED);
        })
    };

    useEffect(() => {
        fetchSessions();
    }, [isSessionSelected])

    return (
        <section className="space-y-5 text-gray-100">
            <Toast 
            message={toast.message}
            status={toast.status}
            isOpen={toast.isOpen}
            onClose={() => setToast({ ...toast, isOpen: false })}
            />
            <div>
                <h2 className="text-xl">Sessions</h2>
                <p className="text-gray-400 text-lg">Here you can see all your sessions</p>
            </div>

            <hr className="border-gray-500" />

            <div className="space-y-5">
                <div className="space-y-2">
                    <h1 className="text-xl mb-5">Current Session</h1>
                    <div className="flex flex-col w-[90%] space-y-5 text-white">
                    {currentSession.map( ({ lastAccessedTime, address, device, location, id }) => (
                        <div key={id} className="bg-gray-500 bg-opacity-20 rounded-3xl p-2 space-y-2 text-lg">
                            <h1><span className="text-gray-400">Device:</span> {device.browser} | {device.platform}</h1>
                            <h1><span className="text-gray-400">Location:</span> {address}</h1>
                            <h1 className="text-base text-gray-300 text-opacity-40">{location} | {dayjs(lastAccessedTime).format("MM-DD-YYYY-HH:mm")}</h1>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="space-y-1 flex flex-col">
                    <h1 className="text-xl mb-5">Active Sessions</h1>
                    <div className="flex flex-col w-[90%] space-y-5 text-white">
                        {activeSessionData.map( ({ lastAccessedTime, address, device, location, id }) => (
                            <div key={id} className="bg-gray-500 bg-opacity-20 rounded-3xl p-2 space-y-2 text-lg flex justify-between items-center">
                                <div>
                                    <h1><span className="text-gray-400">Device:</span> {device.browser} | {device.platform}</h1>
                                    <h1><span className="text-gray-400">Location:</span> {address}</h1>
                                    <h1 className="text-base text-gray-300 text-opacity-40">{location} | {dayjs(lastAccessedTime).format("MM-DD-YYYY-HH:mm")}</h1>
                                </div>
                                <div>
                                    <button 
                                        className="px-4 py-2 bg-red-700 bg-opacity-40 text-gray-200 rounded-full transition duration-500 hover:bg-red-900 focus:outline-none"
                                        onClick={() => handleDeactivation(id)}
                                    >
                                        Deactivate Session
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Sessions;