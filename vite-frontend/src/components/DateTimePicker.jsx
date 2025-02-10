import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { generateData, months } from "../utils/calendar";
import { CalendarIcon } from "@heroicons/react/24/outline";

const DateTimePicker = ({ selectedDate, setSelectedDate }) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const calendarRef = useRef(null);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarData = generateData(currentMonth, currentYear);

  const handleDateClick = (date) => {
    const newDate = selectedDate
      .set("date", date.date())
      .set("month", date.month())
      .set("year", date.year());
    setSelectedDate(newDate);
    updateDateTime(newDate);
  };

  const handleTimeChange = (e, field) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      const newDate = selectedDate.set(field, value);
      setSelectedDate(newDate);
      updateDateTime(newDate);
    }
  };

  const updateDateTime = (date) => {
    setSelectedDate(date);
  };

  const handleInputClick = () => setIsPickerVisible((prev) => !prev);

  const handleTodayClick = () => {
    const today = dayjs(); // Get today's date
    setCurrentMonth(today.month()); // Set the current month to today's month
    setCurrentYear(today.year()); // Set the current year to today's year
    setSelectedDate(today); 
  };

  const handlePrevMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleNextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleClickOutside = (e) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(e.target) &&
      !e.target.closest("input")
    ) {
      setIsPickerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="relative">
      <div className="relative">
        <input
          value={selectedDate.format("MM/DD/YYYY HH:mm")}
          onClick={handleInputClick}
          readOnly
          className="w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500"
        />
        <CalendarIcon
            onClick={handleInputClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-700 cursor-pointer w-8 h-8 transition duration-500"
        />
      </div>

      {isPickerVisible && (
        <div
          ref={calendarRef}
          className="absolute md:w-96 md:p-4 bg-time-date-picker rounded shadow text-white"
        >
          <div className="flex justify-between items-center mb-2">
            <button onClick={handlePrevMonth}>&lt;</button>
            <span>{`${months[currentMonth]} ${currentYear}`}</span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>

          <div className="flex gap-5">
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-gray-500 font-semibold">
                  {day}
                </div>
              ))}
              {calendarData.map(({ date, currentMonth, today }, index) => (
                <div
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`p-2 cursor-pointer flex items-center justify-center hover:bg-gray-600 bg-opacity-20 rounded-3xl ${
                    currentMonth ? "text-white" : "text-gray-600"
                  } ${
                    selectedDate && date.isSame(selectedDate, "day")
                      ? "bg-blue-800 bg-opacity-60 rounded-3xl"
                      : ""
                  }`}
                >
                  {date.date()}
                </div>
              ))}
            </div>
            <div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="hour">
                    Hour:
                  </label>
                  <input
                    id="hour"
                    type="number"
                    value={selectedDate.hour()}
                    onChange={(e) => handleTimeChange(e, "hour")}
                    className="border border-gray-700 rounded-lg p-1 w-16 bg-gray-700 bg-opacity-20 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500"
                    min={0}
                    max={23}
                    step={1}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 space-x-2">
                  <label htmlFor="minute">
                    Minute:
                  </label>
                  <input
                    id="minute"
                    type="number"
                    value={selectedDate.minute()}
                    onChange={(e) => handleTimeChange(e, "minute")}
                    className="border border-gray-700 rounded-lg p-1 w-16 bg-gray-700 bg-opacity-20 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500"
                    min={0}
                    max={59}
                    step={1}
                  />
                </div>
                <div className="mt-5">
                  <button 
                    className="border border-gray-700 p-2 rounded-2xl hover:bg-gray-600 transition duration-500"
                    onClick={handleTodayClick}
                  >
                    Today
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DateTimePicker;
