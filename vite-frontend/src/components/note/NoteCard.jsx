import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";

export default function NoteCard({ title, tag, createdAt, onOpen, onDelete, onUpdate }) {
    return (
        <div className="relative group rounded-[3rem] w-full h-full flex items-center justify-between">
            <div className="group flex flex-col text-center truncate whitespace-nowrap text-2xl w-full space-y-5 transition duration-300 opacity-100 group-hover:opacity-0">
                <div className="absolute top-0 right-5 w-3 h-3 rounded-full" style={{ backgroundColor: tag }} />
                <span>{title}</span>
                <span className="text-base opacity-60">{dayjs(createdAt).format("MM.D.YYYY")}</span>
            </div>


            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[3rem]">
                <button 
                    className="text-white text-2xl py-2 px-6 rounded transition duration-500 hover:text-gray-300"
                    onClick={onOpen}
                >
                    Open
                </button>

                <button 
                    className="absolute bottom-4 right-4 text-white hover:text-red-700 transition duration-500"
                    onClick={onDelete}
                >
                    <TrashIcon className="w-7 h-7"/>
                </button>

                <button 
                    className="absolute bottom-4 left-4 text-white hover:text-gray-400 transition duration-500"
                    onClick={onUpdate}
                >
                    <PencilIcon className="w-7 h-7"/>
                </button>
            </div>
        </div>
    );
}
