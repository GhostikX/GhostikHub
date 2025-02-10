import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { Link } from 'react-router-dom';
import ghostImage from "/ghost.png"

const Home = () => {

     const photos = [
        "home-image-0.png",
        "home-image-1.png",
        "home-image-2.png",
        "home-image-3.png",
     ]

     const [photoNumber, setPhotoNumber] = useState(0);
     const photosLength = photos.length -1;

    const prevSlide = () => {
        const isFirstSlide = Number(photoNumber) === 0;
        const newIndex = isFirstSlide ? photosLength : photoNumber - 1;
        setPhotoNumber(newIndex);
    }

    const nextSlide = () => {
        const isLastSlide = Number(photoNumber) === photosLength;
        const newIndex = isLastSlide ? 0 : Number(photoNumber) + 1;
        setPhotoNumber(newIndex);
    };

    return (
        <section id="home" className="bg-home bg-cover bg-center h-full">
            <div className="flex flex-col items-center justify-center h-screen text-center text-4xl space-y-6 sm:space-y-10 px-4 sm:h-[95%]">
                <div className="flex flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-14">
                    <img src={ghostImage} alt="ghost-image" className="w-16 h-16 sm:w-20 sm:h-20" />
                    <h1 className="text-3xl sm:text-4xl">Hub</h1>
                </div>
                
                <div className="flex flex-row space-x-6 text-xl sm:text-2xl">
                    <Link to="/sign-up" className="w-32 sm:w-64">
                        <button
                            className="w-full py-3 bg-gray-800 bg-opacity-80 text-gray-200 rounded-lg transition duration-500 hover:bg-gray-600 focus:outline-none"
                        >
                            Sign Up
                        </button>
                    </Link>

                    <Link to="/login" className="w-32 sm:w-64">
                        <button
                            className="w-full py-3 bg-gray-700 bg-opacity-40 text-gray-200 rounded-lg transition duration-500 hover:bg-gray-600 focus:outline-none"
                        >
                            Log In
                        </button>
                    </Link>
                </div>


                <h1 className='text-white italic text-base sm:text-3xl'>"Ghostik Hub: Streamline Your Time, Learning, and Work!"</h1>
                
                <div className="w-full sm:w-1/2">
                    <div className="relative w-full h-[40vh] sm:h-[60vh] rounded-2xl overflow-hidden">
                        {/* Image */}
                        <div className="absolute inset-0 flex items-center justify-center">
                        <img
                            src={photos[photoNumber]}
                            alt="photo"
                            className="object-contain rounded-2xl w-full h-full"
                        />
                        </div>

                        {/* Left Arrow */}
                        <div 
                        className="absolute top-1/2 left-4 sm:left-7 transform -translate-y-1/2 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-gray-500 transition duration-500 select-none"
                        >
                        <ChevronLeftIcon onClick={prevSlide} className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>

                        {/* Right Arrow */}
                        <div 
                        className="absolute top-1/2 right-4 sm:right-7 transform -translate-y-1/2 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-gray-500 transition duration-500 select-none"
                        >
                        <ChevronRightIcon onClick={nextSlide} className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                    </div>
                </div>
            </div>
            <footer className="absolute bottom-0 w-full text-center py-4 text-gray-400 text-sm bg-black/20">
                © 2024 Ghostik Hub. All rights reserved.
            </footer>
        </section>

    )
}

export default Home;