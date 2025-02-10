import { Xmark, Mail } from "iconoir-react";
import { resendVerificationEmail } from "../../services/user-client";
import { useEffect, useState } from "react";
import Toast from "../common/Toast";
import { toastStatus } from "../../utils/toastStatus";

const EmailConfirmationModal = ({ email, onClose, waitTime = 300 }) => {

    const [remainingTime, setRemainingTime] = useState(waitTime);
    const [isResending, setIsResending] = useState(false);

    const [toast, setToast] = useState({ message: '', status: '', isOpen: false });
    const showToast = (message, status) => {
        setToast({ message, status, isOpen: true });
        setTimeout(() => setToast({ ...toast, isOpen: false }), 3000);
    };

    useEffect(() => {
        // Countdown timer logic
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [remainingTime]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleResendVerificationEmail = () => {
        setIsResending(true)
        resendVerificationEmail(email).then(res => {
            setRemainingTime(waitTime);
            setIsResending(false);
            showToast("The confirmation link has been successfully sent.")
        }).catch(() => {
            showToast("Something went wrong. Please try again.", toastStatus.FAILED);
            setIsResending(false);
        })
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-95 z-50">
            <Toast
                message={toast.message}
                status={toast.status}
                isOpen={toast.isOpen}
                onClose={() => setToast({ ...toast, isOpen: false })}
            />
            <div className="bg-settings relative rounded-lg shadow-lg p-6 w-96 sm:w-[600px] h-auto">
                {/* Close Button */}
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-500"
                    onClick={onClose}
                >
                    <Xmark className="w-7 h-7" />
                </button>

                {/* Modal Content */}
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Mail className="w-10 h-10 text-green-700"/>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-200 mt-4">
                        Email Confirmation
                    </h2>
                    <p className="text-gray-100 text-center mt-2">
                        We have sent an email to{" "}
                        <span className="font-medium text-gray-200">{email}</span>{" "}
                        to confirm your email address. After receiving the email,
                        follow the link provided to complete your registration.
                    </p>
                    {remainingTime > 0 ? (
                        <p className="text-gray-300 text-sm mt-2">
                            You can resend the confirmation email in{" "}
                            <span className="font-medium">{formatTime(remainingTime)}</span>.
                        </p>
                    ) : (
                        <button
                            onClick={handleResendVerificationEmail}
                            disabled={isResending}
                            className="mt-4 text-blue-500 hover:text-blue-700 text-sm"
                        >
                             {isResending ? "Resending..." : "Resend confirmation mail"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmationModal;
