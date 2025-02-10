import { useState, useEffect } from "react";
import TaskProgressBar from "../components/targets/ProgressBar";
import { getTargets, getTasks, updateTask, deleteTask, deleteTarget } from "../services/target-client";
import { Plus } from "iconoir-react";
import { TrashIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ModalCreateUpdateTarget from "../components/targets/ModalCreateUpdateTarget";
import Toast from '../components/common/Toast';
import ModalCreateUpdateTask from "../components/targets/ModalCreateUpdateTask";
import TargetCard from "../components/targets/TargetCard";
import { toastStatus } from "../utils/toastStatus";

const Targets = ({ setIsAuthenticated }) => {

  const [targets, setTargets] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [targetToUpdate, setTargetToUpdate] = useState({
      id: "",
      title: "",
      deadline: "",
  });
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  
  const [tasks, setTasks] = useState([]);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState({
    id: "",
    title: "",
  });

  const [toast, setToast] = useState({ message: '', status: '', isOpen: false });
  const showToast = (message, status) => {
      setToast({ message, status, isOpen: true });
      setTimeout(() => setToast({ ...toast, isOpen: false }), 3000);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTargets = (isSelectFirstTarget = true) => {
    getTargets(currentPage).then(res => {
      setTargets(res.data.content);

      if (res.data.content && isSelectFirstTarget)
        setSelectedTarget(res.data.content[0]);
      if (res.data.page.totalPages === 0)
        setTotalPages(1);
      else
        setTotalPages(res.data.page.totalPages)

    }).catch((err) => {
      if (err.status === 403)
          setIsAuthenticated(false);
        else
        showToast("Something went wrong. Please try again.", toastStatus.FAILED);
    })
  }

  const fetchTasksByTarget = () => {
    if ((selectedTarget && selectedTarget.id)) {
      getTasks(selectedTarget.id).then(res => {
        setTasks(res.data);
      }).catch((err) => {
        if (err.status === 403)
            setIsAuthenticated(false);
        else
          showToast("Something went wrong. Please try again.", toastStatus.FAILED);
      })
    }
  }

  const handleTargetUpdate = (id, title, deadline) => {
    setTargetToUpdate({
      id: id,
      title: title,
      deadline: deadline,
    })
    setIsUpdate(true);
    setIsTargetOpen(true);
  }

  const handleTaskUpdate = (id, title) => {
    setTaskToUpdate({
      id: id,
      title: title,
    })
    setIsUpdate(true);
    setIsTaskOpen(true);
  }

  const handleDeleteTarget = (id) => {
    deleteTarget(id).then(res => {
      if (targets.length === 1 && currentPage !== 0)
        setCurrentPage(currentPage - 1);
        fetchTargets();
        showToast("Successfully deleted!", toastStatus.SUCCESS);
    }).catch(() => {
        showToast("Something went wrong. Please try again.", toastStatus.FAILED)
    })
}

  const handleTaskDelete = (id) => {
    deleteTask(id).then(res => {
      
      fetchTasksByTarget()
      showToast("Successfully deleted!", toastStatus.SUCCESS);
    }).catch(() => {
      showToast("Something went wrong. Please try again.", toastStatus.FAILED);
    })
  }

  const handleToggleCompletion = (taskId, completed) => {
    const newTask = {completed: !completed}
    updateTask(taskId, newTask).then(res => {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
      fetchTargets(false);
    }).catch((err) => {
      if (err.status === 403)
          setIsAuthenticated(false);
      else
        showToast("Something went wrong. Please try again.", toastStatus.FAILED);
    })
  };
  
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
    fetchTargets();
  }, [currentPage])

  useEffect(() => {
    if (selectedTarget && selectedTarget.id)
      fetchTasksByTarget();
  }, [selectedTarget?.id])

  return (
    <section className="min-h-screen w-full xl:h-screen flex justify-center items-center bg-gradient-custom">
      <ModalCreateUpdateTarget isOpen={isTargetOpen} setIsOpen={setIsTargetOpen} isUpdate={isUpdate} setIsUpdate={setIsUpdate} targetToUpdate={targetToUpdate} fetchTargets={fetchTargets} showToast={showToast} />
      <ModalCreateUpdateTask isOpen={isTaskOpen} setIsOpen={setIsTaskOpen} isUpdate={isUpdate} setIsUpdate={setIsUpdate} taskToUpdate={taskToUpdate} fetchTasks={fetchTasksByTarget} targetId={selectedTarget?.id} showToast={showToast} tasksNumber={tasks.length} />
      <Toast 
        message={toast.message}
        status={toast.status}
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
      <div className="w-full xl:w-[90%] flex flex-col sm:pt-12 xl:pt-0 xl:px-10 pb-2 sm:justify-center h-full">
        <div className="flex flex-col xl:flex-row h-full space-y-6 xl:space-y-0 w-full mx-auto sm:w-[80%] sm:h-[90%] xl:w-[90%] 2xl:h-[80%] justify-center items-center pt-14 sm:pt-0">
          
          {/* Left Content */}
          <div className="w-full xl:w-[65%] p-2 xl:px-10 xl:py-7 border rounded-xl border-gray-600 flex flex-col h-full text-gray-100">

            <div className="flex justify-between">
              <h2 className="text-xl 2xl:text-3xl font-bold mb-6">My Targets</h2>
              <button onClick={() => setIsTargetOpen(true)}>
                <Plus className="w-12 h-12 text-white hover:text-gray-400 transition duration-500" />
              </button>
            </div>
            
            {/* Targets content */}
            {targets.length > 0 ? (
              <div className="space-y-4 overflow-y-auto w-full mt-[5%]">
                {targets.map(({ id, title, deadline, tasksCount, progress }) => (
                  <TargetCard 
                    key={id} id={id} title={title} deadline={deadline} tasksCount={tasksCount} progress={progress} selectedTarget={selectedTarget} setSelectedTarget={setSelectedTarget} 
                    onUpdate={() => handleTargetUpdate(id, title, deadline)} handleDeleteTarget={handleDeleteTarget}
                  />
                ))}
              </div>
            ) : (
              <div className="flex text-xl justify-center flex-grow pt-5">
                <h1>No Targets Found...</h1>
              </div>
            )}
            
            {/* Page navigation */}
            <div className="flex items-center justify-center bottom-0 mt-auto">
              <button type="button" className="text-gray-400 hover:text-gray-200 transition duration-500" onClick={prevPage}>
                <ChevronLeftIcon className="w-9 h-9" />
              </button>
              <span className="text-md">{currentPage + 1} / {totalPages}</span>
              <button type="button" className="text-gray-400 hover:text-gray-200 transition duration-500" onClick={nextPage}>
                <ChevronRightIcon className="w-9 h-9" />
              </button>
            </div>
          </div>
          
          {/* Right Content */}
          <div className="w-full sm:w-[100%] xl:w-[45%] h-full flex flex-col justify-center items-center">
            <div className="w-full xl:max-w-[90%] h-full border border-gray-600 rounded-lg p-6 space-y-8">
              <TaskProgressBar tasks={tasks} />
              
              <div className="flex items-center justify-center">
                <button onClick={() => setIsTaskOpen(true)}>
                  <Plus className="w-12 h-12 text-white hover:text-gray-400 transition duration-500" />
                </button>
              </div>
              
              <div className="flex flex-col space-y-5 justify-around overflow-y-auto max-h-[calc(100vh-350px)]">
                {tasks.map(({ id, title, completed }) => (
                  <div key={id} className="flex items-center gap-4 w-full">
                    <div 
                      onClick={() => handleToggleCompletion(id, completed)}
                      className={`
                        w-8 h-8 border rounded-full flex justify-center items-center cursor-pointer transition duration-500
                        ${completed ? 'bg-progress-bar-custom-green' : 'bg-gray-500'} hover:bg-progress-bar-custom-green hover:opacity-70 transition duration-500
                        `}
                    />
                    <div className="flex items-center justify-between w-[85%]">
                      <h1 
                        className={`w-72 sm:w-96 truncate text-xl text-white ${completed ? 'line-through' : ''}`}>
                        {title}
                      </h1>
                      <div className="flex gap-5">
                        <button className="w-7 h-10 hover:text-gray-700 transition duration-500" onClick={() => handleTaskUpdate(id, title)}>
                          <PencilIcon />
                        </button>
                        <button className="w-7 h-10 hover:text-red-700 transition duration-500" onClick={() => handleTaskDelete(id)}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Targets;