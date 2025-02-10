import { useState, useRef, useEffect } from "react";

const TimePicker = ({hour, setHour, minute, setMinute}) => {
  const [isOpen, setIsOpen] = useState(false);

  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const timePickerRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleHourSelect = (selectedHour) => {
    setHour(selectedHour);
  };

  const handleMinuteSelect = (selectedMinute) => {
    setMinute(selectedMinute);
  };

  const handleClickOutside = (e) => {
    if (
      timePickerRef.current &&
      !timePickerRef.current.contains(e.target) &&
      !e.target.closest("input")
    ) {
      toggleDropdown()
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hours = [];
  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    hours.push(formattedHour);
  }

  const minutes = [];
  for (let minute = 0; minute < 60; minute++) {
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
    minutes.push(formattedMinute);
  }

  const handleScroll = (e, columnType) => {
    if (columnType === "hour") {
      const scrollHeight = hourRef.current.scrollHeight;
      const scrollTop = hourRef.current.scrollTop;
      const offsetHeight = hourRef.current.offsetHeight;

      if (scrollTop <= 0) {
        hourRef.current.scrollTop = scrollHeight / 2;
      } else if (scrollTop + offsetHeight >= scrollHeight) {
        hourRef.current.scrollTop = scrollHeight / 2;
      }
    } else if (columnType === "minute") {
      const scrollHeight = minuteRef.current.scrollHeight;
      const scrollTop = minuteRef.current.scrollTop;
      const offsetHeight = minuteRef.current.offsetHeight;

      if (scrollTop <= 0) {
        minuteRef.current.scrollTop = scrollHeight / 2;
      } else if (scrollTop + offsetHeight >= scrollHeight) {
        minuteRef.current.scrollTop = scrollHeight / 2;
      }
    }
  };

  return (
    <div className="relative w-full">
      <label htmlFor="time-picker" className="block text-gray-400 text-sm mb-2">
        Select Time
      </label>
      <input
        type="text"
        id="time-picker"
        className="w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500"
        value={`${hour}:${minute}`}
        readOnly
        onClick={toggleDropdown}
      />

      {isOpen && (
        <div ref={timePickerRef} className="bg-gray-800 bg-opacity-60 absolute mt-1 left-0 border border-gray-400 rounded-lg shadow-lg z-10 max-h-48 flex items-center justify-center text-gray-300 w-[50%]">
          <div className="flex">
            {/* Hour Column */}
            <ul
              ref={hourRef}
              className="w-1/2 max-h-40 py-2 text-lg overflow-y-scroll scrollbar-hidden"
              onScroll={(e) => handleScroll(e, "hour")}
            >
              {[...hours, ...hours].map((h, index) => (
                <li
                  key={h + index}
                  className={`py-1 px-4 cursor-pointer transition duration-500 ${
                    h === hour ? "bg-gray-500 bg-opacity-40 rounded-3xl text-white" : "hover:text-white"
                  }`}
                  onClick={() => handleHourSelect(h)}
                >
                  {h}
                </li>
              ))}
            </ul>

            {/* Minute Column */}
            <ul
              ref={minuteRef}
              className="w-1/2 max-h-40 py-2 text-lg overflow-y-scroll scrollbar-hidden"
              onScroll={(e) => handleScroll(e, "minute")}
            >
              {[...minutes, ...minutes].map((m, index) => (
                <li
                  key={index}
                  className={`py-1 px-4 cursor-pointer transition duration-500 ${
                    m === minute ? "bg-gray-500 bg-opacity-40 rounded-3xl text-whit" : "hover:text-white"
                  }`}
                  onClick={() => handleMinuteSelect(m)}
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
