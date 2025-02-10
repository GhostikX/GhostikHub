import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { CalendarIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import { generateData, months } from '../utils/calendar'
import ModalCreateCalendar from '../components/calendar/ModalCreateCalendar';
import { deleteCalendarById, getAllUniqueDaysInMonth, getCalendars } from '../services/calendar-client';
import SearchReminders from "../components/calendar/SearchReminders";
import Toast from '../components/common/Toast';
import { toastStatus } from '../utils/toastStatus';

export default function Calendar({ setIsAuthenticated }) {

    const [loading, setLoading] = useState(false);
    const currentDate = dayjs();

    const [isFoundModal, setIsFoundModal] = useState(false);
    const [searchTitle, setSearchTitle] = useState('');
    
    const [open, setOpen] = useState(false);
    const [today, setToday] = useState(currentDate);
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [reminder, setReminder] = useState([]);
    const [markDate, setMarkDate] = useState([]);
    

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [toast, setToast] = useState({ message: '', status: '', isOpen: false });
    const showToast = (message, status) => {
        setToast({ message, status, isOpen: true });
        setTimeout(() => setToast({ ...toast, isOpen: false }), 3000);
    };

    const fetchReminders = () => {
        getCalendars(today.month() + 1, today.year(), page).then(res => {
            setReminder(res.data.content);
            if (res.data.page.totalPages === 0)
                setTotalPages(1);
            else
                setTotalPages(res.data.page.totalPages)
        }).catch((err) => {
            if (err.status === 403)
                setIsAuthenticated(false);
            showToast("Something went wrong. Please try again.", toastStatus.FAILED);
        })
    }

    useEffect(() => {
        fetchReminders();
    }, [today, page]);

    const deleteReminder = (id) => {
        deleteCalendarById(id).then(res => {
            if (reminder.length === 1 && page !== 0)
                setPage(page - 1);
            fetchReminders();
            showToast("Successfully deleted!", toastStatus.SUCCESS);
        }).catch((err) => {
            if (err.status === 401)
                setIsAuthenticated(false);
            showToast("Something went wrong. Please try again.", toastStatus.FAILED);
        })
    }

    const fetchAllDateInCalendar = () => {
        getAllUniqueDaysInMonth(today.month() + 1, today.year()).then(res => {
            setMarkDate(res.data);
        }).catch(() => {
            showToast("Something went wrong. Please try again.", toastStatus.FAILED);
        })
    }

    useEffect(() => {
        fetchAllDateInCalendar();
    }, [today, reminder])

    const prevPage = () => {
        if (page !== 0) {
            setPage(page - 1);
        }
    }

    const nextPage = () => {
        if (page !== totalPages - 1){
            setPage(page + 1);
        }
    }

    return (
        <section className="min-h-screen flex justify-center items-center bg-gradient-custom w-full">
            <ModalCreateCalendar open={open} onClose={() => setOpen(false)} selectedDate={selectedDate} setSelectedDate={setSelectedDate} fetchCalendars={fetchReminders} showToast={showToast} />
            <SearchReminders 
                isOpen={isFoundModal} 
                onClose={() => { setIsFoundModal(false); }} 
                deleteReminder={deleteReminder}
                title={searchTitle}
                showToast={showToast}
            />
            <Toast
                message={toast.message}
                status={toast.status}
                isOpen={toast.isOpen}
                onClose={() => setToast({ ...toast, isOpen: false })}
            />
            <div className="w-[90%] h-full md:h-[80%] xl:pl-0 grid grid-cols-1 xl:grid-cols-2 pt-10 md:pt-0 gap-6 my-5 justify-items-center items-center">
                {/* Calendar Section */}
                <div className="bg-calendar p-5 md:p-10 rounded-lg h-auto flex flex-col border border-gray-700 xl:w-[90%] 2xl:w-full sm:w-[80%]">
                    
                    {/* Calendar header */}
                    <div className="flex items-center justify-between mb-2 md:mb-10 mx-2">
                        <h2 className="text-white font-semibold text-lg md:text-xl xl:text-2xl flex-grow text-start mr-5">
                            {months[today.month()]} <span>{today.year()}</span>
                        </h2>
                        <div className="flex items-center space-x-2 md:space-x-3 flex-grow justify-end">
                            <button 
                            className='flex items-center text-white text-lg md:text-xl border border-slate-700 bg-slate-800 rounded-xl px-3 py-2 hover:text-gray-400 transition duration-500'
                            onClick={() => setToday(currentDate)}
                            >
                            <CalendarIcon className='h-6 w-6 xl:h-8 xl:w-8' />
                            <span className='ml-2'>Today</span>
                            </button>

                            <button 
                            type="button" 
                            className="text-slate-200 hover:bg-slate-600 hover:text-gray-400 rounded-full transition duration-500 border border-slate-200"
                            onClick={() => {
                                setToday(today.month(today.month() - 1));
                                setPage(0);
                            }}
                            >
                            <ChevronLeftIcon className="h-6 w-6 xl:h-9 xl:w-9" />
                            </button>
                            <button 
                            type="button" 
                            className="text-slate-200 hover:bg-slate-600 hover:text-gray-400 rounded-full transition duration-500 border border-slate-200 "
                            onClick={() => {
                                setToday(today.month(today.month() + 1));
                                setPage(0);
                            }}
                            >
                            <ChevronRightIcon className="h-6 w-6 xl:h-9 xl:w-9" />
                            </button>
                        </div>
                    </div>

                    {/* Days of the week */}
                    <div className="grid grid-cols-7 text-center font-semibold text-white text-xs md:text-lg mb-6">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>

                    {/* Calendar Dates */}
                    <div className="grid grid-cols-7 mt-2 md:mt-4 text-center text-white text-base md:text-xl gap-3 2xl:gap-8 place-items-center">
                        {generateData(today.month(), today.year()).map(({ date, currentMonth, today }, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`
                                        ${ currentMonth ? "" : "text-gray-500" } 
                                        ${ today ? "bg-red-800" : "" }
                                        flex flex-col justify-center items-center rounded-full border-gray-600 w-16 h-16 hover:bg-gray-700 cursor-pointer transition duration-500`
                                    }
                                    onClick={() => {
                                        setSelectedDate(date);
                                        setOpen(true)
                                    }}
                                >
                                    {date.date()}
                                    { markDate.some((mark) => dayjs(mark.reminderAt).isSame(date, 'day')) ? (
                                        <div className='w-2 h-2 mt-1 rounded-full bg-fuchsia-800' /> 
                                    ) : (<div className='w-2 h-2 mt-1' /> )}
                                </div> 
                            )
                        })}
                    </div>
                </div>
                
                {/* Schedule Section */}
                <div className="2xl:p-6 rounded-lg h-full xl:w-full sm:w-[80%]">
                    <div className="flex items-center justify-between mb-4 2xl:mb-10">
                        <div className='space-y-4'>
                            <h1 className="text-white font-semibold text-xl xl:text-2xl">Schedule</h1>
                            <h1 className='text-base xl:text-lg'>{months[today.month()]} {today.year()}</h1>
                        </div>
                        <div className='flex flex-col items-end justify-end space-y-4'>
                            <div className='flex flex-row items-center'>
                                <button type="button" className="text-gray-400 hover:text-gray-200 transition duration-500">
                                    <ChevronLeftIcon className='w-9 h-9' onClick={prevPage} />
                                </button>
                                    <span className='text-md'>{page + 1} / {totalPages}</span>
                                <button type='button' className="text-gray-400 hover:text-gray-200 transition duration-500">
                                    <ChevronRightIcon className='w-9 h-9' onClick={nextPage} />
                                </button>
                            </div>
                            <div className="flex relative">
                                <input
                                    type="text"
                                    className="w-full h-10 pl-4 pr-10 rounded-xl bg-gray-700 bg-opacity-40 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    placeholder="Search..."
                                    value={searchTitle}
                                    onChange={e => setSearchTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            setIsFoundModal(true);
                                        }
                                    }}
                                />
                                <button 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition duration-500"
                                    onClick={() => setIsFoundModal(true)}
                                >
                                    <MagnifyingGlassIcon className='w-6 h-6' />
                                </button>
                            </div>
                        </div>
                    </div>

                    {reminder.length !== 0 ? (
                    <div className="space-y-6 w-full">
                        {reminder.map(( { id, title, reminderAt } ) => (
                            today.month() === dayjs(reminderAt).month() && today.year() === dayjs(reminderAt).year() && (
                            <div 
                                key={id} 
                                className={`flex items-center p-4 rounded-2xl shadow-md border border-gray-600 hover:bg-gray-700 hover:bg-opacity-50 transition duration-500 ${dayjs().isAfter(reminderAt) ? 'opacity-30' : ''}`}
                            >
                                <div className="flex-shrink-0 bg-gray-700 text-white rounded-lg text-base md:text-lg text-center w-16 h-16">
                                    <p>{dayjs(reminderAt).format("D")}</p> 
                                    <p>{dayjs(reminderAt).format("MMM")}</p>
                                </div>

                                <div className="ml-4 w-[70%]">
                                    <p className="text-white font-semibold truncate">{title}</p>
                                    <p className="text-gray-400 text-sm md:text-base">
                                        {dayjs(reminderAt).format("hh:mm A, dddd, MMM D")} 
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
                            )
                        ))}
                    </div>
                     ) : (<div><h1 className='text-white text-xl'>No reminders...</h1></div>)}
                </div>
            </div>
        </section>
    )
}