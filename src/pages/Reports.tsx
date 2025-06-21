import { Download } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import DateRangePicker from "../components/Reports/DateRangePicker";
import UsageChart from "../components/Reports/UsageChart";
import { useAuth } from "../context/AuthContext";
import { getMaterialUsageByDateRange } from "../services/materialService";
import { MaterialUsage } from "../types";

const Reports: React.FC = () => {
  const [usageData, setUsageData] = useState<MaterialUsage[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const { isAdmin } = useAuth();

  const handleGenerateReport = async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      const data = await getMaterialUsageByDateRange(startDate, endDate);
      setUsageData(data);
      setDateRange({ start: startDate, end: endDate });
    } catch (error) {
      toast.error("Не вдалося згенерувати звіт про використання");
      console.error("Error generating report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (usageData.length === 0) {
      toast.warning("Немає даних для експорту");
      return;
    }

    // Create CSV content
    const headers = ["Матеріал", "Робітник", "Використано", "Дата", "Нотатка"];
    const csvContent = [
      headers.join(";"),
      ...usageData.map((usage) =>
        [
          `"${usage.material.name}"`,
          `"${usage.employee.fullName}"`,
          usage.amountUsed,
          new Date(usage.usageDate).toLocaleDateString(),
          `"${usage.comment.replace(/"/g, '""')}"`,
        ].join(";")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `material-usage-report-${dateRange?.start}-to-${dateRange?.end}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Згенерувати звіт про використання
        </h2>
        <DateRangePicker onSubmit={handleGenerateReport} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : usageData.length > 0 ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Результати використання: від{" "}
              {new Date(dateRange?.start).toLocaleDateString()} до{" "}
              {new Date(dateRange?.end).toLocaleDateString()}
            </h2>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Download className="h-4 w-4 mr-1" />
              Експортувати в CSV
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <UsageChart
              usageData={usageData}
              title="Використання матеріалів за кількістю"
            />

            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Підсумок використання
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Матеріал
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Загальна кількість
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(
                        usageData.reduce((acc, usage) => {
                          if (!acc[usage.material.name]) {
                            acc[usage.material.name] = 0;
                          }
                          acc[usage.material.name] += usage.material.amount;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([material, amount], index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {material}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {amount} шт.
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : dateRange ? (
        <div className="bg-white shadow sm:rounded-lg p-6 text-center">
          <p className="text-gray-500">
            Даних про використання для обраного періоду не знайдено. Оберіть
            інший проміжок.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Reports;
