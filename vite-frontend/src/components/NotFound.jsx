const NotFound = ({ isAuthenticated }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-red-700">404</h1>
      <p className="text-xl text-white mt-4">Page Not Found</p>
      <a
        href={`${isAuthenticated ? '/dashboard' : '/'}`}
        className="mt-5 px-4 py-2 bg-gray-700 bg-opacity-40 text-gray-200 rounded-md transition duration-500 hover:bg-gray-600 focus:outline-none"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound;
