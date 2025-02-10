import { useState, useEffect } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { addTask, updateTask } from "../../services/target-client";
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import ConfirmButton from "../common/ConfirmButton";
import { toastStatus } from "../../utils/toastStatus";

const ModalCreateUpdateTask = ({ isOpen, setIsOpen, isUpdate, setIsUpdate, taskToUpdate, fetchTasks, targetId, showToast, tasksNumber }) => {
    const [title, setTitle] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen && isUpdate && taskToUpdate) {
            setTitle(taskToUpdate.title);
        } else {
            setTitle('');
        }
    }, [isOpen, isUpdate, taskToUpdate]);

    const validateData = () => {
        const errors = {};
        if(tasksNumber >= 10) errors.general = 'You can only create up to 10 tasks.'
        if (!title) errors.title = 'Title is required';
        if (title.length < 2) errors.title = 'Title must be greater than 2 characters';
        if (title.length > 60) errors.title = 'Title cannot exceed 60 characters';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleCreateUpdateTask = () => {
        if (!validateData()) return;
        if (!isUpdate) {
            const newTask = {
                title: title
            }

            // save the new Task
            addTask(newTask, targetId).then(res => {
                fetchTasks();
                showToast("Successfully created!", toastStatus.SUCCESS);
            }).catch(() => {
                showToast("Something went wrong. Please try again.", toastStatus.FAILED)
            }).finally(() => {
                setIsOpen(false);
            })
        }
        if (isUpdate && taskToUpdate) {
            const newTask = {
                title: title,
            }

            updateTask(taskToUpdate.id, newTask).then(res => {
                fetchTasks();
                showToast("Successfully updated!", toastStatus.SUCCESS);
            }).catch(() => {
                showToast("Something went wrong. Please try again.", toastStatus.FAILED)
            }).finally(() => {
                setIsOpen(false);
                setIsUpdate(false);
            })
        }
    }

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 w-full h-full">
                <div className="relative p-4 w-full max-w-lg">
                    <div className="bg-modal rounded-lg">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold text-white">{isUpdate ? `Update task title` : 'New task'}</h2>
                            <button 
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex 
                                            items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white transition duration-500"
                                onClick={() => { setIsOpen(false); setIsUpdate(false); setErrors({}); }}
                            >
                                <XMarkIcon className="w-7 h-7" />
                            </button>
                        </div>
                        {errors.general && <p className='text-red-600 text-opacity-70 p-2 text-center'>{errors.general}</p>}
                        <div className="p-4">
                            <p className="text-gray-400 text-sm mb-4">Enter task name</p>
                            <div className="relative mb-4">
                                <input 
                                    type="text"
                                    placeholder="Your title"
                                    value={title}
                                    onChange={e => setTitle(capitalizeFirstLetter(e.target.value))}
                                    className={`
                                        w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                                        ${errors.title ? 'border-red-600 border-opacity-40' : ''}
                                        `} 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateUpdateTask();
                                        }
                                    }}
                                />
                                {errors.title && <p className='text-red-600 text-opacity-70 p-1'>{errors.title}</p>}
                            </div>

                            <ConfirmButton onClick={handleCreateUpdateTask} />
                        </div>
                    </div>
                </div>
            </div>
        )
)
}

export default ModalCreateUpdateTask;