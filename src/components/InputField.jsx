const InputField = ({ label, name, type = "text", placeholder, value, onChange }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
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
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
    </div>
);

export default InputField;