import React, { useState } from "react";
import {
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from "lucide-react";

type SortPanelProps = {
  fields: { value: string; label: string }[];
  onSortChange: (field: string, direction: "asc" | "desc") => void;
};

const SortPanel: React.FC<SortPanelProps> = ({ fields, onSortChange }) => {
  const [selectedField, setSelectedField] = useState(fields[0]?.value || "");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newField = e.target.value;
    setSelectedField(newField);
    onSortChange(newField, sortDirection);
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    onSortChange(selectedField, newDirection);
  };

  return (
    <div className="flex items-center justify-center p-3 lg:px-3 lg:py-0 sm:justify-end w-full lg:w-1/2 border-2 gap-2 border-gray-300 rounded-lg ">
      <label className="text-sm font-medium text-gray-700">Сортувати за:</label>
      <select
        value={selectedField}
        onChange={handleFieldChange}
        className="border-2 border-gray-300 px-2 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {fields.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>

      <button
        onClick={toggleSortDirection}
        className="px-2 py-1 border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-300 transition"
        title={`За ${sortDirection === "asc" ? "спаданням" : "зростанням"}`}
      >
        {sortDirection === "asc" ? (
          <span className="inline-flex items-center gap-2">
            <ArrowDownWideNarrow size={20} />
            За спаданням
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <ArrowDownNarrowWide size={20} />
            За зростанням
          </span>
        )}
      </button>
    </div>
  );
};

export default SortPanel;
