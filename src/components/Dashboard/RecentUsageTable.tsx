import React from "react";
import { RecentUsages } from "../../types";

interface RecentUsageTableProps {
  usageData: RecentUsages[];
}

const RecentUsageTable: React.FC<RecentUsageTableProps> = ({ usageData }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-blue-500 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-50">
          Нещодавні використання
        </h3>
      </div>
      <div>
        <table className="min-w-full text-sm text-gray-700 bg-slate-50 border-gray-200">
          <thead>
            <tr className="text-gray-800 uppercase text-xs tracking-wider">
              <th className="px-6 py-3 text-left">Матеріал</th>
              <th className="px-6 py-3 text-left">Працівник</th>
              <th className="px-6 py-3 text-left">Використано</th>
              <th className="px-6 py-3 text-left">Дата</th>
            </tr>
          </thead>
          <tbody>
            {usageData.length > 0 ? (
              usageData.map((usage, index) => (
                <tr
                  key={usage.id}
                  className={`${
                    index === 0 ? "bg-white/90" : "bg-white"
                  } border-t border-b border-gray-300 transition duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                    {usage.material.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {usage.employee.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {usage.amountUsed} шт.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(usage.usageDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Немає даних про використання
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentUsageTable;
