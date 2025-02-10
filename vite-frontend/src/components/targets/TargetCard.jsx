import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";

export default function TargetCard({ id, title, deadline, tasksCount, progress, onUpdate, setSelectedTarget, selectedTarget, handleDeleteTarget }) {

    return (
        <div 
        onClick={() => setSelectedTarget({ id, title, deadline, progress })}
        className={`group relative border border-gray-600 h-20 p-4 rounded-2xl flex items-center cursor-pointer transition-all duration-500 box-border w-full hover:bg-gray-900 
            ${selectedTarget?.id === id ? 'bg-gray-800' : ''}`
        }
        >
            <div className="flex gap-3 w-full justify-between text-lg opacity-100 group-hover:opacity-0 transition-opacity duration-500 text-center">
                <h1 className="w-64 truncate">{title}</h1>
                <h1>{tasksCount} tasks</h1>
                <h1>{Math.round(progress)}%</h1>
                <h1>Deadline: {dayjs(deadline).format("DD MMMM")}</h1>
            </div>

            <div className="absolute inset-0 flex p-6 items-center justify-between opacity-0 group-hover:opacity-100 bg-opacity-70 rounded-2xl transition-opacity duration-500 ease-in-out">
                <h1 className="w-[60%] text-lg truncate">{title}</h1>
                <div className="flex gap-2">
                    <button
                        className="bottom-4 right-4 text-white hover:text-gray-400 transition duration-500"
                        onClick={(e) => {
                        e.stopPropagation();
                        onUpdate();
                        }}
                    >
                        <PencilIcon className="w-7 h-7" />
                    </button>
                    <button
                        className="bottom-4 left-4 text-white hover:text-red-700 transition duration-500"
                        onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTarget(id);
                        }}
                    >
                        <TrashIcon className="w-7 h-7" />
                    </button>
                </div>
            </div>
        </div>

    );
}