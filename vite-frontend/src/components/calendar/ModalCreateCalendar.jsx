import dayjs from 'dayjs';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createCalendar } from '../../services/calendar-client';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import TimePicker from '../TimePicker';
import ConfirmButton from '../common/ConfirmButton';
import { toastStatus } from '../../utils/toastStatus';

const ModalCreateCalendar = ({ open, onClose, selectedDate, setSelectedDate, fetchCalendars, showToast }) => {

    const currentTime = dayjs();
    const [hour, setHour] = useState(currentTime.hour().toString().padStart(2, '0'));
    const [minute, setMinute] = useState(currentTime.minute().toString().padStart(2, '0'));
    const [newReminder, setNewReminder] = useState({
        title: '',
        reminderAt: ''
    });

    const [errors, setErrors] = useState({});

    const validateData = () => {
        const errors = {};
        if (!newReminder.title) errors.title = 'Title is required';
        if (newReminder.title.length < 2) errors.title = 'Title must be greater than 2 characters';
        if (newReminder.title.length > 60) errors.title = 'Title cannot exceed 60 characters';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const hanldeCreate = (e) => {
        e.preventDefault();
        if (!validateData()) return;
        
        const date = dayjs(selectedDate).format('YYYY-MM-DD');
    
        const isoString = new Date(`${date}T${hour}:${minute}:00Z`).toISOString();
    
        setNewReminder(prevReminder => ({
            ...prevReminder,
            reminderAt: isoString
        }));

        createCalendar({ ...newReminder, reminderAt: isoString })
            .then(res => {
                fetchCalendars();
                showToast("Successfully created!", toastStatus.SUCCESS);
                setHour(currentTime.hour().toString().padStart(2, '0'));
                setMinute(currentTime.minute().toString().padStart(2, '0'));
            })
            .catch(() => {
                showToast("Something went wrong. Please try again.", toastStatus.FAILED)
            })
            .finally(() => {
                setSelectedDate(null);
                setNewReminder({ title: '', reminderAt: '' });
                onClose();
            });
    }
      

    return (
        <div onClick={onClose} className={`fixed top-0 left-0 z-40 bg-neutral-900 bg-opacity-80 flex items-center justify-center w-full h-full ${open ? "visible bg-black/20" : "invisible"}`}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
            >
                <div className="relative p-4 w-full max-w-lg">
                    {/* Modal content */}
                    <div className="relative rounded-lg shadow bg-modal">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-white">
                                New reminder
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex 
                                            items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white transition duration-500"
                            >
                                <XMarkIcon className='w-7 h-7'/>
                            </button>
                        </div>

                    {/* Modal body */}
                        <div className="p-6">
                            <form className="space-y-4">
                                <div>
                                    <label
                                        className="block text-gray-400 text-sm mb-2"
                                    >
                                        Your title
                                    </label>
                                    <input
                                        type="text"
                                        name='title'
                                        className={`
                                            w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                                            ${errors.title ? 'border-red-600 border-opacity-40' : ''}
                                        `}
                                        placeholder="Make a dinner"
                                        value={newReminder.title}
                                        onChange={e => setNewReminder({...newReminder, title: capitalizeFirstLetter(e.target.value)})}
                                        required
                                    />
                                    {errors.title && <p className='text-red-600 text-opacity-70 p-1'>{errors.title}</p>}
                                </div>

                                <div>
                                    <TimePicker hour={hour} setHour={setHour} minute={minute} setMinute={setMinute} />
                                </div>

                                <ConfirmButton onClick={hanldeCreate} />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalCreateCalendar;
