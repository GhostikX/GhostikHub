import axios from "axios";

export const getTargets = async (page) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/targets?page=${page}`,
            {
                withCredentials: true,
            }
        )
    } catch (err) {
        throw err;
    }
}

export const addTarget = async (targetData) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/targets`,
            targetData,
            {
                withCredentials: true,
            }
        )
    } catch (err) {
        throw err;
    }
}

export const updateTarget = async (targetId, updatedTarget) => {
    try {
        return await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/targets/${targetId}`,
            updatedTarget,
            {
                withCredentials: true,
            }
        )
    } catch (err) {
        throw err;
    }
}

export const deleteTarget = async (targetId) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/targets/${targetId}`,
            {
                withCredentials: true,
            }
        )
    } catch (err) {
        throw err;
    }
}

export const getTasks = async (targetId) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/targets/${targetId}/tasks`,
            {
                withCredentials: true,
            }
        )
    } catch (err) {
        throw err;
    }
}

export const addTask = async (taskData, targetId) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/tasks/${targetId}`,
            taskData,
            {
                withCredentials: true,
            }
        )
    } catch (err) {
        throw err;
    }
}

export const updateTask = async (taskId, updatedTask) => {
    try {
        return await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`,
            updatedTask,
            {
                withCredentials: true,
            }
        )
    } catch (err) {
        throw err;
    }
}

export const deleteTask = async (taskId) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`,
            {
                withCredentials: true,
            }
        )
    } catch (err) {
        throw err;
    }
}