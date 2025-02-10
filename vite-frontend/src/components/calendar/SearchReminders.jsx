import { useState, useEffect, useCallback } from 'react';
import { TrashIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { searchRemindersByTitle } from '../../services/calendar-client';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { toastStatus } from '../../utils/toastStatus';
import dayjs from 'dayjs';

const SearchReminders = ({ isOpen, onClose, deleteReminder, title, showToast }) => {

    const [foundReminders, setFoundReminders] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (!isOpen || !title) return;
        searchRemindersByTitle(capitalizeFirstLetter(title), page).then(res => {
            setFoundReminders(res.data.content);
            if (res.data.page.totalPages > 0)
                setTotalPages(res.data.page.totalPages);
        }).catch(() => {
            showToast("Something went wrong. Please try again.", toastStatus.FAILED)
        })
    }, [page, isOpen])


    const prevPage = useCallback(() => {
        if (page !== 0) setPage(page - 1);
    }, [page]);
    
    const nextPage = useCallback(() => {
        if (page < totalPages - 1) setPage(page + 1);
    }, [page, totalPages]);

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen && title ? 'block' : 'hidden'}`}>
            <div className="bg-gray-800 rounded-lg p-6 lg:w-1/2 w-[80%]">
                <div className='flex justify-between'>
                    <h2 className="md:text-lg font-bold text-white mb-4">Found Reminders</h2>
                    <button
                        className="mb-4 hover:text-white transition duration-500"
                        onClick={onClose}
                    >
                        <XMarkIcon className='w-7 h-7' />
                    </button>
                </div>
                {foundReminders.length > 0 ? (
                    <ul className="space-y-2">
                        {foundReminders.map(({ id, title, reminderAt }) => (
                            <div key={id} className="flex items-center bg-gray-900 p-4 rounded-2xl shadow-md border border-gray-600 hover:bg-gray-800 transition duration-500">
                                <div className="flex-shrink-0 bg-gray-700 text-white rounded-lg p-2 text-base md:text-lg text-center md:w-20 md:h-20">
                                    <p>{dayjs(reminderAt).format("D")}</p> 
                                    <p>{dayjs(reminderAt).format("MMM")}</p>
                                </div>

                                <div className="ml-4">
                                    <p className="text-white font-semibold">{title}</p>
                                    <p className="text-gray-400 text-sm md:text-base">
                                        {dayjs(reminderAt).format("hh:mm A, dddd, MMM D, YYYY")} 
                                    </p>
                                </div>
                                <div className='ml-auto w-10 h-10'>
                                    <button 
                                        className='w-7 h-10 hover:text-red-700 transition duration-500'
                                        onClick={() => deleteReminder(id)}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No reminders found.</p>
                )}
                <div className='flex flex-row items-center justify-center mt-5'>
                    <button type="button" className="text-gray-400 hover:text-gray-200 transition duration-500">
                        <ChevronLeftIcon className='w-9 h-9' onClick={prevPage} />
                    </button>
                    <span className='text-md'>{page + 1} / {totalPages}</span>
                    <button type='button' className="text-gray-400 hover:text-gray-200 transition duration-500">
                        <ChevronRightIcon className='w-9 h-9' onClick={nextPage} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchReminders;