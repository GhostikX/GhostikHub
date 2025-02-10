import axios from "axios";

export const performRegistration = async (registerForm) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/users`,
            registerForm,
            {
                withCredentials: true
            }
        )
    } catch (e) {
        throw e;
    }
}

export const performUserUpdate = async (updateForm) => {
    try {
        return await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/users`,
            updateForm,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}

export const performEmailVerification = async (token, username) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/users/verify-email?token=${token}&name=${username}`,
        )
    } catch (e) {
        throw e;
    }
}

export const resendVerificationEmail = async (email) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/users/resend-verification-email?email=${email}`,
        )
    } catch (e) {
        throw e;
    }
}