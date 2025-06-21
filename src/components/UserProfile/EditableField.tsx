import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setTempValue(value); // тільки якщо ми не редагуємо
    }
  }, [value, isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleBlur = () => {
    if (tempValue !== value && tempValue.trim() !== "") {
      onChange(tempValue); // тільки якщо дійсно щось ввели
    } else {
      setTempValue(value); // скидаємо до початкового
    }
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="inline-flex justify-start items-center gap-2 w-full">
        <input
          ref={inputRef}
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          readOnly={!isEditing}
          onBlur={handleBlur}
          className={`w-full rounded-md border-2 px-4 py-2 text-sm transition-all duration-200 focus:outline-none ${
            isEditing
              ? "border-blue-500 bg-white focus:ring-0 "
              : "bg-gray-100 border-gray-300 cursor-default"
          }`}
        />
        {!isEditing && (
          <button
            type="button"
            onClick={handleEditClick}
            className="border-2 rounded-md p-2 border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-600 transition"
          >
            <Pencil size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default EditableField;
