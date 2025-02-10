import axios from "axios";

export const checkSession = async (userData) => {
    try {
        return await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/sessionState`,
        userData,
        {
            withCredentials: true,
        }
    )} catch (e) {
        throw e;
    }
}

export const performLogin = async (loginForm) => {
    try {
        return await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth`,
            loginForm,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}

export const performLogout = async () => {
    try {
        return await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
            {},
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}

export const fetchIP = async () => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_IP_URL}`
        )
    } catch (e) {
        throw e;
    }
}

export const getUserSessions = async () => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/auth/userSessions`,
            {
                withCredentials: true
            }
        )
    } catch (err) {
        throw err;
    }
}

export const deactivateSession = async (sessionId) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/auth/deactivate`,
            {
                data: { sessionId },
                withCredentials: true,
            }
        )
    } catch (err) {
        throw err;
    }
}