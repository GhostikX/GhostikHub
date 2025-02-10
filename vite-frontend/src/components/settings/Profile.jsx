import { useState } from "react";
import { performUserUpdate } from "../../services/user-client";
import Toast from "../common/Toast";
import { toastStatus } from "../../utils/toastStatus";

const Profile = ({ isProfileSelected }) => {

    if (!isProfileSelected) return;

    const [errors, setErrors] = useState({});
    const [userData, setUserData] = useState({ email: '', currentPassword: '', newPassword: '' });
    const [toast, setToast] = useState({ message: '', status: '', isOpen: false });
    const showToast = (message, status) => {
        setToast({ message, status, isOpen: true });
        setTimeout(() => setToast({ ...toast, isOpen: false }), 3000);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForSpaces = (inputField) => {
        const hasSpaces = /\s/;
        return hasSpaces.test(inputField)
      }

    const validateData = () => {
        const errors = {};
        if (userData.email.length > 0) {
            if (!validateEmail(registrationForm.email)) errors.email = 'Email must be in correct form'
        }
        if (userData.currentPassword.length > 0) {
            if (userData.currentPassword.length < 8) errors.currentPassword = 'Current Password must be at least 8 characters';
            if (userData.currentPassword === userData.newPassword) errors.newPassword = 'New password must be different from the Current Password';
            
            if (userData.newPassword.length > 0) {
                if (userData.newPassword.length < 8) errors.newPassword = 'New Password must be at least 8 characters';
            } else {
                errors.newPassword = 'New Password is required';
            }
        } else if (userData.newPassword.length > 0) {
            errors.currentPassword = 'Current Password is required to change the New password';
        }
        else if (validateForSpaces(userData.currentPassword)) errors.password = 'Current Password should not contain any spaces' 
        if (userData.email.length === 0 && userData.currentPassword.length === 0) errors.global = "Update form cannot be full empty"
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleUpdating = () => {
        if (!validateData()) return;
        performUserUpdate(userData).then(res => {
            showToast("Successfully updated!", toastStatus.SUCCESS)
        }).catch((err) => {
            if (err.status === 422)
                setErrors({ global: "Password is incorrect" })
            else 
                showToast("Something went wrong. Please try again.", toastStatus.FAILED)
        }).finally(() => {
            setUserData({ email: '', currentPassword: '', newPassword: '' });
        })
    }

    return (
        <section className="space-y-5">
            <Toast
                message={toast.message}
                status={toast.status}
                isOpen={toast.isOpen}
                onClose={() => setToast({ ...toast, isOpen: false })}
            />
            <div>
                <h2 className="text-xl text-gray-200">Profile</h2>
                <p className="text-gray-400 text-lg">Here you can change your user details</p>
            </div>

            <hr className="border-gray-500" />
            <div className="space-y-5">
                <div className="space-y-2">
                    <label
                        className="block mb-2 text-lg font-medium text-white"
                    >
                        Email
                    </label>
                    <input
                        type="text"
                        name='email'
                        className={`
                            w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                            ${errors.email ? 'border-red-600 border-opacity-40' : ''}
                            `} 
                        value={userData.email}
                        onChange={e => setUserData({...userData, email: e.target.value})}
                    />
                    {errors.email && <p className='text-red-600 text-opacity-70 p-1'>{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <label
                        className="block mb-2 text-lg font-medium text-white"
                    >
                        Current Password
                    </label>
                    <input
                        type="password"
                        name='currentPassword'
                        className={`
                            w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                            ${errors.currentPassword ? 'border-red-600 border-opacity-40' : ''}
                            `}
                        value={userData.currentPassword}
                        onChange={e => setUserData({...userData, currentPassword: e.target.value})}
                    />
                    {errors.currentPassword && <p className='text-red-600 text-opacity-70 p-1'>{errors.currentPassword}</p>}
                </div>

                <div className="space-y-2">
                    <label
                        className="block mb-2 text-lg font-medium text-white"
                    >
                        New Password
                    </label>
                    <input
                        type="password"
                        name='newPassword'
                        className={`
                            w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                            ${errors.newPassword ? 'border-red-600 border-opacity-40' : ''}
                            `}
                        value={userData.newPassword}
                        onChange={e => setUserData({...userData, newPassword: e.target.value})}
                    />
                    {errors.newPassword && <p className='text-red-600 text-opacity-70 p-1'>{errors.newPassword}</p>}
                </div>

                {errors.global && <p className='text-red-600 text-opacity-70 p-1'>{errors.global}</p>} 

                <div>
                    <button
                        className="px-4 py-2 bg-gray-700 bg-opacity-40 text-gray-200 rounded-md transition duration-500 hover:bg-gray-600 focus:outline-none"
                        onClick={handleUpdating}
                    >
                        Update Account
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Profile;