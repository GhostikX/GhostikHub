import { motion } from 'framer-motion';

const TaskProgressBar = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  
  return (
    <div className="w-full max-w-[70%] mx-auto mt-4 transition duration-500">
      <div className="text-center text-2xl mb-2 text-gray-100">
        {completedTasks} of {totalTasks} tasks completed
      </div>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <span className="text-base font-semibold">Progress</span>
          <span className="text-base font-semibold">{Math.round(progress)}%</span>
        </div>

        <div className="flex mb-2">
          <div className="w-full bg-gray-300 rounded-xl border border-gray-500 h-5 overflow-hidden">
            <motion.div
                className="bg-progress-bar-custom-green h-full border border-gray-500"
                // Animate the width of the progress bar
                animate={{ width: `${progress}%` }}
                initial={{ width: 0 }} // Initial width can be 0, starting from empty
                transition={{ duration: 1 }}
              />
          </div>
        </div>

      </div>
    </div>
  );
  };

  export default TaskProgressBar;