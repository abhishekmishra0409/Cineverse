const InputField = ({ label, name, type = "text", placeholder, value, onChange }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-200 dark:text-gray-300">
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
            className="bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-500 text-white text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
    </div>
);

export default InputField;