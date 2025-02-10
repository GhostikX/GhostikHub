const InputColorField = ({ selectedColor, setSelectedColor }) => {
  const colors = ["#e63946", "#d896ff", "#40916c", "#1d3557", "#f5f3f4"];

  return (
    <div className="flex items-center w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500">
      <span className="text-gray-400 mr-4">Tags:</span>
      <div className="flex space-x-3">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full cursor-pointer border-2 hover:opacity-20 transition duration-500 ${
              selectedColor === color ? "border-blue-400" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
        
      </div>
    </div>
  );
};

export default InputColorField;
