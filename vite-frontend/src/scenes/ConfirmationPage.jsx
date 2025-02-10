import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { performEmailVerification } from "../services/user-client";
import { CheckCircle, XmarkCircle } from "iconoir-react";
import { toastStatus } from "../utils/toastStatus";
import Toast from "../components/common/Toast";

const ConfirmationPage = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const username = queryParams.get("name");

    const [toast, setToast] = useState({ message: '', status: '', isOpen: false });
    const showToast = (message, status) => {
        setToast({ message, status, isOpen: true });
        setTimeout(() => setToast({ ...toast, isOpen: false }), 3000);
    };

    useEffect(() => {
        performEmailVerification(token, username).then(res => {
            setIsVerified(true);
        }).catch(() => {
            showToast("Something went wrong. Please try again.", toastStatus.FAILED);
        })
    }, [token, username])

    return (
        <section className="pt-5 flex justify-center items-start min-h-screen">
        <Toast 
          message={toast.message}
          status={toast.status}
          isOpen={toast.isOpen}
          onClose={() => setToast({ ...toast, isOpen: false })}
        />
            <div className="flex justify-center items-center border p-5 rounded-xl border-gray-700 bg-settings text-white">
                {isVerified ? (
                    <div className="flex flex-col items-center gap-5 text-xl">
                        <div className="flex items-center justify-between gap-2 text-xl">
                            <h1>Verification completed successfully</h1>
                            <CheckCircle className="w-& h-& text-green-700" />
                        </div>
                        <div className="w-full text-lg px-4 py-2 bg-gray-700 bg-opacity-40 text-gray-200 rounded-md transition duration-500 hover:bg-gray-600 focus:outline-none text-center">
                            <button onClick={() => navigate("/login")}>Go to Login</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-5 text-xl">
                        <div className="flex items-center justify-between gap-2 text-xl">
                            <h1>Verification failed</h1>
                            <XmarkCircle className="w-8 h-8 text-red-700" />
                        </div>
                </div>
                )}
            </div>
        </section>
    )
}

export default ConfirmationPage;