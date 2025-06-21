import React from "react";

interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, value }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        readOnly
        className="sm:w-3/6 w-full rounded-md border-2 border-gray-300 bg-gray-200 px-4 py-2 text-sm text-gray-700 cursor-not-allowed focus:outline-none"
      />
    </div>
  );
};

export default ReadOnlyField;
