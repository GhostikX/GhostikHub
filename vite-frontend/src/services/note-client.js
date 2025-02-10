import axios from "axios";

export const createNote = async (note) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/notes`,
            note,
            {
                withCredentials: true
            }
        )
    } catch (e) {
        throw e;
    }
}

export const updateNote= async (noteId, updatedNote) => {
    try {
        return await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/notes/${noteId}`,
            updatedNote,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}

export const deleteNoteById = async (noteId) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/notes/${noteId}`,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}

export const getAllNotes = async (page) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/notes?page=${page}&size=15`,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}

export const searchAllNotesByTitle = async (title, page) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/notes/searchByTitle/${title}?page=${page}`,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}

export const searchAllNotesByTag = async (tag, page) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/notes/searchByTag/${tag}?page=${page}`,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}


export const getNoteSnapshotData = async (noteId) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/notes/getNoteData/${noteId}`,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    } 
}

export const saveSnapshot = async (noteId, snapshotId, updatedSnapshot) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/snapshots/${noteId}?snapshotId=${snapshotId}`,
            updatedSnapshot,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}

export const getSnapshotById = async (snapshotId, noteId) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/snapshots/${snapshotId}?noteId=${noteId}`,
            {
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}

export const saveImage = async (image) => {
    try {
        return await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/assets`,
            image,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}

export const getImage = async (fileName) => {
    try {
        return await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/files/${fileName}`,
            {
                responseType: 'blob',
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}

export const deleteImages = async (fileNames, noteId) => {
    try {
        return await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/assets/${noteId}`,
            {
                data: fileNames,
                withCredentials: true,
            }
        )
    } catch (e) {
        throw e;
    }
}