import { useState } from "react";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { searchAllNotesByTag, searchAllNotesByTitle } from "../../services/note-client";
import { colors } from "../../utils/colors";
import { toastStatus } from "../../utils/toastStatus";

const SearchNotes = ({ setNotes, fetchNotes, setTotalPages, currentPage, showToast }) => {

    const [searchTitle, setSearchTitle] = useState('');

    const fetchFoundNotes = (title) => {
        if (title.length > 0) {
            searchAllNotesByTitle(capitalizeFirstLetter(title), 0).then(res => {
                setNotes(res.data.content);
                if (res.data.page.totalPages > 0) {
                    setTotalPages(res.data.page.totalPages)
                }
            }).catch((err) => {
                if (err.status !== 404)
                    showToast("Something went wrong. Please try again.", toastStatus.FAILED);
            })  
        } else {
            fetchNotes(currentPage);
        }
    }

    const handleTagClicked = (tag) => {
        if (!tag) return;
        searchAllNotesByTag(encodeURIComponent(tag), 0).then(res => {
            setNotes(res.data.content);
            if (res.data.page.totalPages > 0) {
                setTotalPages(res.data.page.totalPages)
            }
            else {
                setTotalPages(1);
            }
        }).catch(err => {
            showToast("Something went wrong. Please try again.", toastStatus.FAILED);
        })
    }

    return (
        <div className="sm:flex sm:space-x-5 space-y-5 sm:space-y-0 w-full justify-center">
            <div className="relative lg:w-1/4">
                <input
                    value={searchTitle}
                    onChange={e => setSearchTitle(e.target.value)}
                    type="text"
                    className="w-full h-10 pl-4 pr-10 rounded-xl bg-gray-700 bg-opacity-20 text-white transition duration-500 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    placeholder="Search..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            fetchFoundNotes(searchTitle);
                        }
                    }}
                />
                <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-500"
                    onClick={() => fetchFoundNotes(searchTitle)}    
                >
                    <MagnifyingGlassIcon className='w-6 h-6' />
                </button>
            </div>

            <div className="flex space-x-3 items-center justify-center">
                {colors.map((color, index) => (
                    <div
                        key={index}
                        className="w-6 h-6 rounded-full cursor-pointer border-2 hover:opacity-20 transition duration-500"
                        style={{ backgroundColor: color }}
                        onClick={() => handleTagClicked(color.toString())}
                    />
                ))}
            </div>
        </div>
    )
}

export default SearchNotes;