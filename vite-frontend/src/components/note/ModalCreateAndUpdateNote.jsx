import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import { createNote, updateNote } from "../../services/note-client";
import { useState, useEffect } from "react";
import ConfirmButton from '../common/ConfirmButton';
import InputColorField from '../calendar/InputColorField';
import { toastStatus } from '../../utils/toastStatus';

const ModalCreateAndUpdateNote = ({ isOpen, setIsOpen, isUpdate, selectedNote, fetchNotes, currentPage, showToast }) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && isUpdate && selectedNote) {
            setTitle(selectedNote.title);
            setTag(selectedNote.tag);
        } else {
            setTitle('');
        }
    }, [isOpen, isUpdate, selectedNote]);

    const validateData = () => {
        const errors = {};
        if (!title) errors.title = 'Title is required';
        if (title.length < 2) errors.title = 'Title must be greater than 2 characters';
        if (title.length > 60) errors.title = 'Title cannot exceed 60 characters';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const hanldeCreateNewNote = () => {
        if (validateData()) {
            if (!isUpdate && !selectedNote) {
                const newNote = {
                    title: title,
                    tag: tag,
                    snapshotData: "",
                }
    
                createNote(newNote).then(res => {
                    navigate(res.data.noteId)
                    showToast("Successfully created!", toastStatus.SUCCESS)
                }).catch(() => {
                    showToast("Something went wrong. Please try again.", toastStatus.FAILED)
                })
            }
            if (isUpdate && selectedNote) {
                const newNote = {
                    title: title,
                    tag: tag,
                }
        
                updateNote(selectedNote.id, newNote).then(res => {
                    fetchNotes(currentPage);
                    setIsOpen(false);
                    showToast("Successfully updated!", toastStatus.SUCCESS)
                }).catch( () => {
                    showToast("Something went wrong. Please try again.", toastStatus.FAILED)
                })
            }
        }
    }

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                <div className='relative p-4 w-full max-w-lg'>
                    <div className="rounded-lg bg-modal">

                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold text-white">{isUpdate ? `Update note` : 'New note'}</h2>
                            <button 
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex 
                                                items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white transition duration-500"
                                onClick={() => {setIsOpen(false);} }
                            >
                                <XMarkIcon className="w-7 h-7" />
                            </button>
                        </div>

                        <div className="p-4">
                            <p className="text-gray-400 text-sm mb-4">Enter note name:</p>
                            <div className="relative mb-4 space-y-4">
                                <div>
                                    <input 
                                        type="text"
                                        placeholder="Your title"
                                        value={title}
                                        required
                                        onChange={e => setTitle(e.target.value)}
                                        className={`
                                            w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                                            ${errors.title ? 'border-red-600 border-opacity-40' : ''}
                                            `} 
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                hanldeCreateNewNote();
                                            }
                                        }}
                                    />
                                    {errors.title && <p className='text-red-600 text-opacity-70 p-1'>{errors.title}</p>}
                                </div>

                                <div className='flex flex-row justify-between'>
                                    <p className="text-gray-400 text-sm">Choose a tag:</p>
                                    <p className="text-gray-400 text-sm">(Optional)</p>
                                </div>
                                <InputColorField selectedColor={tag} setSelectedColor={setTag} />
                            </div>

                            <ConfirmButton onClick={hanldeCreateNewNote} />
                        </div>

                    </div>
                </div>
            </div>
        )
)
}

export default ModalCreateAndUpdateNote;