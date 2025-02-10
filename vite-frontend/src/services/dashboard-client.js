import axios from "axios";

export const getDashboard = async (day, limit) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/dashboard?day=${day}&limit=${limit}`,
            {
                withCredentials: true
            }
        )
    } catch (e) {
        throw e;
    }
}