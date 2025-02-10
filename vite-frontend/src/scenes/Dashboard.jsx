import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard-client";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { getNoteSnapshotData } from "../services/note-client";
import useMediaQuery from "../hooks/useMediaQuery";

const Dashboard = ({ setIsAuthenticated }) => {
  const [notes, setNotes] = useState([]); 
  const [reminders, setReminders] = useState([]);
  const [targets, setTargets] = useState([]);
  const [username, setUsername] = useState('');
  const [pageLimit, setPageLimit] = useState();
  const navigate = useNavigate();
  const isAboveAverageScreens = useMediaQuery("(min-height: 1100px)");

  useEffect(() => {
    if (!isAboveAverageScreens) {
      setPageLimit(6);
    } else {
      setPageLimit(7);
    }
  }, [isAboveAverageScreens]);

  useEffect(() => {
    if (pageLimit) {
      getDashboard(dayjs().format('YYYY-MM-DDTHH:mm:ss'), pageLimit).then((res) => {
        setNotes(res.data.notes);
        setReminders(res.data.calendars);
        setTargets(res.data.targets);
        setUsername(res.data.username);
      }).catch((err) => {
        if (err.status === 401)
            setIsAuthenticated(false);
      })
    }
  }, [pageLimit])

  function handleMoveToNote(noteId) {
    getNoteSnapshotData(noteId).then(res => {
        navigate(`/notes/${noteId}`)
    }).catch((err) => {
      if (err.status === 403)
          setIsAuthenticated(false);
    })
  }

  return (
    <section className="text-white min-h-screen flex justify-center pb-5 sm:pt-0 2xl:pt-10 bg-gradient-custom w-full">
      {/* Main Content */}
      <main className="flex flex-col md:p-6 xl:pt-9 w-[90%] 2xl:w-[85%] sm:ml-20 justify-center">

        {/* Main Content Grid */}
        <div className="flex flex-col space-y-8 xl:space-y-0 xl:flex-row xl:space-x-8 h-[95%]">

          {/* Left Section */}
          <div className="flex-1 space-y-10">
            {/* My Last Notes */}
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg md:text-xl font-bold">My Last Notes</h2>
                <Link
                  to="/notes"
                  className="opacity-50 hover:opacity-90 transition duration-500"
                >
                  See All
                </Link>
              </div>
              {notes.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {notes.map(({ noteId, title, createdAt }) => (
                    <div
                      key={noteId}
                      className="bg-slate-900 p-4 rounded-3xl w-full sm:w-[48%] md:w-[31%] flex justify-between"
                    >
                      <div className="w-[70%]">
                        <h3 className="font-bold text-lg truncate">{title}</h3>
                        <p className="text-sm text-gray-400 mt-2">
                          {dayjs(createdAt).format("MM.D.YYYY")}
                        </p>
                      </div>
                      <button
                        className="w-30 p-2 text-xl rounded-xl transition-all duration-500 ease-in-out hover:bg-slate-700 border border-gray-700"
                        onClick={() => handleMoveToNote(noteId)}
                      >
                        open
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <h1 className="text-lg md:text-xl opacity-70">No Notes Yet...</h1>
                </div>
              )}
            </div>
    
            {/* My Targets */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold">My Targets</h2>
                <Link
                  to="/targets"
                  className="opacity-50 hover:opacity-90 transition duration-500"
                >
                  See All
                </Link>
              </div>
              {targets.length > 0 ? (
                <div className="space-y-4 2xl:space-y-8">
                  {targets.map(({ id, title, progress, tasksCount, deadline }) => (
                    <div
                      key={id}
                      className="bg-slate-600 bg-opacity-20 flex flex-col sm:flex-row items-center justify-between p-4 2xl:h-20 rounded-xl border border-gray-700 hover:bg-gray-700 transition duration-500 ease-in-out"
                    >
                      <span className="font-medium text-center">{title}</span>
                      <div className="flex flex-wrap gap-4 justify-center mt-2 sm:mt-0">
                        <span className="text-sm sm:text-lg text-gray-400">
                          {progress}%
                        </span>
                        <span className="text-sm sm:text-lg text-gray-400">
                          {tasksCount} tasks
                        </span>
                        <span className="text-sm sm:text-lg text-gray-400">
                          Deadline {dayjs(deadline).format("DD MMM")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center pt-10">
                  <h1 className="text-lg md:text-3xl opacity-70">
                    No Targets Found...
                  </h1>
                </div>
              )}
            </div>
          </div>
    
          {/* Right Section */}
          <div className="flex flex-col h-full w-[50%]">
            <div className="flex justify-end items-center">
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-lg md:text-xl">Hello, {username}!</span>
              </div>
            </div>
    
            {/* Calendar */}
            <div className="bg-calendar p-4 2xl:p-10 rounded-lg border border-gray-700 h-full 2xl:h-[85%]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg md:text-xl font-bold">Calendar For Today</h2>
                <Link
                  to="/calendar"
                  className="opacity-50 hover:opacity-90 transition duration-500"
                >
                  See All
                </Link>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-gray-400 mb-8">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, index) => (
                    <span
                      key={index}
                      className={`${
                        dayjs().format("ddd") === day ? "text-cyan-500" : ""
                      }`}
                    >
                      {day}
                    </span>
                  )
                )}
              </div>
              {reminders.length > 0 ? (
                <div className="flex flex-col space-y-4 2xl:space-y-8">
                  {reminders.map(({ id, title, reminderAt }) => (
                    <div
                      key={id}
                      className="p-4 2xl:p-5 rounded-xl hover:bg-gray-700 transition duration-500 ease-in-out border border-gray-700"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm md:text-lg">{title}</p>
                        <span className="text-sm md:text-lg text-gray-400">
                          {dayjs(reminderAt).format("hh:mm")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <h1 className="text-lg md:text-3xl opacity-70">
                    No Events Today...
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </section>

  );
}
  
export default Dashboard;