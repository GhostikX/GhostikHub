import axios from "axios";

export const getAllCalendars = async () => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/users/calendar`,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw(e);
    }
}

export const getCalendars = async (month, year, page) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/calendar/sorted?month=${month}&year=${year}&page=${page}`,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw(e);
    }
}

export const getAllUniqueDaysInMonth = async (month, year) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/calendar/unique?month=${month}&year=${year}`,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw(e);
    }
}

export const searchRemindersByTitle = async (title, page) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/calendar/search/${title}?page=${page}`,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw(e);
    }
}

export const createCalendar = async (createdCalendar) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/calendar/saveCalendar`,
            createdCalendar,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw(e);
    }
}

export const deleteCalendarById = async (id) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/calendar/${id}`,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}