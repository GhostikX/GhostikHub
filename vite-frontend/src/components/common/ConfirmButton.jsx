const ConfirmButton = ({ onClick }) => {
    return (
      <div className="flex justify-end mt-5">
        <button 
          className="px-4 py-2 bg-gray-700 bg-opacity-40 text-gray-200 rounded-md transition duration-500 hover:bg-gray-600 focus:outline-none"
          onClick={onClick}
        >
          Confirm
        </button>
      </div>
    );
  };
  
  export default ConfirmButton;