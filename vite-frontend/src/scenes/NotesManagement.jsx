import React, { useEffect, useState } from 'react';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ModalCreateNote from '../components/note/ModalCreateAndUpdateNote';
import { deleteNoteById, getAllNotes, getSnapshotById } from '../services/note-client';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/note/NoteCard';
import SearchNotes from '../components/note/SearchNotes';
import Toast from '../components/common/Toast';
import { toastStatus } from '../utils/toastStatus';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useMediaQuery from "../hooks/useMediaQuery";

const NotesManagement = ({ setIsAuthenticated }) => {

    
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    const [notes, setNotes] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);

    const isAboveSmallScreens = useMediaQuery("(min-width: 640px)");

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    
    const [noteData, setNoteData] = useState({
        title: "",
        id: ""
    });

    const [toast, setToast] = useState({ message: '', status: '', isOpen: false });
    const showToast = (message, status) => {
        setToast({ message, status, isOpen: true });
        setTimeout(() => setToast({ ...toast, isOpen: false }), 3000);
    };

    function handleMoveToNote(noteId) {
        navigate(noteId);
    }

    const fetchNotes = (page) => {
        setLoading(true);
        getAllNotes(page).then(res => {
            setNotes(res.data.content);
            if (res.data.page.totalPages === 0)
                setTotalPages(1);
            else 
                setTotalPages(res.data.page.totalPages)
        }).catch((err) => {

            if (err.status === 403)
                setIsAuthenticated(false);
            else
                showToast("Something went wrong. Please try again.", toastStatus.FAILED);
        }).finally(() => {
            setLoading(false);
        })
    }

    function handleDeleteNote(snapshotId) {
        deleteNoteById(snapshotId).then(res => {
            if (notes.length === 1 && currentPage !== 0)
                setCurrentPage(currentPage - 1);
            fetchNotes(currentPage);
            showToast("Successfully deleted!", toastStatus.SUCCESS)
        }).catch((err) => {
            if (err.status === 403)
                setIsAuthenticated(false);
            else
                showToast("Something went wrong. Please try again.", toastStatus.FAILED);
        })
    }

    function handleUpdateNote(id, title, tag) {
        setNoteData({
            title: title,
            tag: tag,
            id: id
        })
        setIsUpdate(true);
        setIsOpen(true);
    }

    function handleCreateNote() {
        setIsUpdate(false);
        setNoteData("")
        setIsOpen(true);
    }

    useEffect(() => {
        fetchNotes(currentPage);
    }, [currentPage])

    const prevPage = () => {
        if (currentPage !== 0) {
            setCurrentPage(currentPage - 1);
        }
    }

    const nextPage = () => {
        if (currentPage !== totalPages - 1){
            setCurrentPage(currentPage + 1);
        }
    }

    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => {
                return (
                    <LoadingSpinner loading={loading} showSpinner={true} />
                )
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [loading])

    return (
        <section className='min-h-screen flex justify-center items-center bg-gradient-custom w-full'>
            {isOpen && <ModalCreateNote isOpen={isOpen} setIsOpen={setIsOpen} isUpdate={isUpdate} selectedNote={noteData} fetchNotes={fetchNotes} currentPage={currentPage} showToast={showToast} />}
            <Toast
                message={toast.message}
                status={toast.status}
                isOpen={toast.isOpen}
                onClose={() => setToast({ ...toast, isOpen: false })}
            />
            <div className="min-h-screen text-white flex w-full">
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Navbar */}
                    <nav className="py-4 px-6 flex items-center justify-center">
                        <SearchNotes setNotes={setNotes} fetchNotes={fetchNotes} currentPage={currentPage} setTotalPages={setTotalPages} showToast={showToast} />
                    </nav>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col items-center p-4 sm:px-10 lg:px-16">
                        {isAboveSmallScreens ? (
                            <div className="relative flex justify-between items-center w-full h-[150px]">
                                {/* Page Navigation aligned to the right */}
                                <div className="flex items-center space-x-4 absolute right-10 top-1/2 transform -translate-y-1/2">
                                    <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-200 transition duration-500"
                                    onClick={prevPage}
                                    >
                                    <ChevronLeftIcon className="w-9 h-9" />
                                    </button>
                                    <span className="text-md">{currentPage + 1} / {totalPages}</span>
                                    <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-200 transition duration-500"
                                    onClick={nextPage}
                                    >
                                    <ChevronRightIcon className="w-9 h-9" />
                                    </button>
                                </div>

                                {/* Plus Icon Centered in the Circle */}
                                <div className="bg-gray-700 bg-opacity-20 flex justify-center items-center rounded-full w-[150px] h-[150px] cursor-pointer border-[3px] border-gray-600 hover:border-gray-400 transition-colors duration-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <button className="p-4 w-full h-full flex justify-center items-center" onClick={handleCreateNote}>
                                        <PlusIcon className="w-20 h-20" />
                                    </button>
                                </div>
                            </div>

                        ) : (
                            <div className='flex flex-col items-center gap-5'>
                                <div className="bg-gray-700 bg-opacity-20 flex justify-center items-center rounded-full w-[150px] h-[150px] cursor-pointer border-[3px] border-gray-600 hover:border-gray-400 transition duration-500">
                                    <button className="p-4 w-full h-full flex justify-center items-center" onClick={handleCreateNote}>
                                        <PlusIcon className="w-20 h-20" />
                                    </button>
                                </div>
                                <div className="flex items-center space-x-4 right-10">
                                    <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-200 transition duration-500"
                                    onClick={prevPage}
                                    >
                                    <ChevronLeftIcon className="w-9 h-9" />
                                    </button>
                                    <span className="text-md">{currentPage + 1} / {totalPages}</span>
                                    <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-200 transition duration-500"
                                    onClick={nextPage}
                                    >
                                    <ChevronRightIcon className="w-9 h-9" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Placeholder Cards */}
                        {notes.length > 0 ? (
                            <div className="w-[90%] grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-5 gap-14 mt-10">
                                    {/* Placeholder Notes */}
                                    {notes.map(({ noteId, title, tag, createdAt }) => (
                                        <div key={noteId} className="flex items-center justify-center border-[1px] border-gray-600 bg-gray-600 bg-opacity-5 p-4 rounded-[3rem] w-auto h-[300px] hover:border-gray-400 hover:scale-105 transition duration-500">
                                            <NoteCard title={title} tag={tag} createdAt={createdAt} onOpen={() => handleMoveToNote(noteId)} onDelete={() => handleDeleteNote(noteId)} onUpdate={() => handleUpdateNote(noteId, title, tag)} />
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className='flex pt-5 h-full items-start w-[90%]'>
                                <h1 className='text-2xl'>No Notes Found...</h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotesManagement;
