import React, { useEffect, useState } from "react";
import { EmployeeBrief, MaterialBrief, MaterialUsage } from "../../types";
import { Search } from "lucide-react";
import { getCategory, getEmployeePosition, getUnit } from "../../utils/utils";
import {
  getBriefEmployees,
  getEmployeeById,
} from "../../services/employeeService";
import { toast } from "react-toastify";
import { getBriefMaterials } from "../../services/materialService";
import { useAuth } from "../../context/AuthContext";
import { ADMIN, EMPLOYEE } from "../../constants/constants";
import SortPanel from "../Common/SortPanel/SortPanel";

interface UsageLogListProps {
  usageLog: MaterialUsage[];
  onFilterChange: (filters: {
    materialId?: number;
    employeeId?: number;
  }) => void;
}

const UsageLogList: React.FC<UsageLogListProps> = ({
  usageLog,
  onFilterChange,
}) => {
  const [employees, setEmployees] = useState<EmployeeBrief[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | "">("");
  const [materials, setMaterials] = useState<MaterialBrief[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | "">("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState("quantity");
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const sortFields = [
    { value: "amountUsed", label: "Використанням" },
    { value: "createdAt", label: "Датою додавання" },
  ];

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortOrder(direction);
  };

  const fetchBriefEmployees = async () => {
    try {
      const response = await getBriefEmployees();
      setEmployees(response);
    } catch (error) {
      toast.error("Не вдалося отримати список співробітників");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeById = async () => {
    try {
      const response = await getEmployeeById(user?.id);
      setEmployees([response]);
    } catch (error) {
      toast.error("Не вдалося отримати список співробітників");
      console.error("Error fetching employees:", error);
    }
  };

  const fetchBriefMaterials = async () => {
    try {
      const response = await getBriefMaterials();
      setMaterials(response);
    } catch (error) {
      toast.error("Не вдалося отримати список матеріалів");
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === ADMIN) {
      fetchBriefEmployees();
    } else if (user?.role === EMPLOYEE) {
      fetchEmployeeById();
    }
    fetchBriefMaterials();
  }, []);

  useEffect(() => {
    onFilterChange({
      materialId: selectedMaterialId === "" ? undefined : selectedMaterialId,
      employeeId: selectedEmployeeId || undefined,
    });
  }, [selectedMaterialId, selectedEmployeeId]);

  const searchTerms = search.toLowerCase().split(" ").filter(Boolean);
  const filteredUsageLog = usageLog
    .filter((log) => {
      const employeeName = log.employee.fullName.toLowerCase();
      const materialname = log.material.name.toLowerCase();

      const matchesSearch = searchTerms.every(
        (term) => materialname.includes(term) || employeeName.includes(term)
      );
      return matchesSearch;
    })
    .sort((a, b) => {
      const direction = sortOrder === "asc" ? 1 : -1;

      if (sortField === "amountUsed") {
        return (a.amountUsed - b.amountUsed) * direction;
      }

      if (sortField === "createdAt") {
        return (
          (new Date(b.usageDate).getTime() - new Date(a.usageDate).getTime()) *
          direction
        );
      }

      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      {user?.role === ADMIN ? (
        <div className="flex flex-wrap flex-col justify-start gap-4">
          <div className="flex justify-start gap-4 sm:flex-nowrap flex-wrap">
            <select
              className="px-4 py-2 border-2 w-full sm:w-1/2 border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
              value={selectedMaterialId}
              onChange={(e) =>
                setSelectedMaterialId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            >
              <option value="">Всі матеріали</option>
              {materials.map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.name} | {getCategory(mat.category)}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-2 border-2 w-full sm:w-1/2 border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
              value={selectedEmployeeId}
              onChange={(e) =>
                setSelectedEmployeeId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            >
              <option value="">Всі співробітники</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} | {getEmployeePosition(emp.position)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between lg:flex-nowrap flex-wrap gap-4">
            <div className="flex items-center border-2 border-gray-300 rounded-lg bg-gray-50 w-full lg:w-1/2">
              <Search size={20} className="text-gray-400 mx-3" />
              <input
                type="text"
                placeholder="Пошук..."
                className="bg-transparent w-full py-2 outline-none active:border-gray-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <SortPanel fields={sortFields} onSortChange={handleSortChange} />
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <select
            className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
            value={selectedMaterialId}
            onChange={(e) =>
              setSelectedMaterialId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          >
            <option value="">Всі матеріали</option>
            {materials.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.name} | {getCategory(mat.category)}
              </option>
            ))}
          </select>

          <div className="flex items-center border-2 border-gray-300 rounded-lg bg-gray-50">
            <Search className="h-5 w-5 text-gray-400 mx-3" />
            <input
              type="text"
              placeholder="Пошук..."
              className="bg-transparent outline-none py-2 active:border-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-2 border-2 text-gray-400 border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 active:border-gray-700"
          >
            {sortOrder === "asc" ? "Less → More" : "More → Less"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto max-w-full">
        <table className="w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Матеріал
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Категорія
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Працівник
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Використано
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Дата
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                Нотатка
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
            {filteredUsageLog.length > 0 ? (
              filteredUsageLog.map((usage) => (
                <tr key={usage.id}>
                  <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {usage.material.name} ({usage.material.quantity}{" "}
                    {getUnit(usage.material.unit)})
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                    {getCategory(usage.material.category)}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                    {usage.employee.fullName} (
                    {getEmployeePosition(usage.employee.position)})
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {usage.amountUsed}
                  </td>
                  <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(usage.usageDate).toLocaleDateString()}
                  </td>
                  <td
                    className="p-4 text-sm text-gray-500 truncate"
                    title={usage.comment}
                  >
                    {usage.comment}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  Нічого не знайдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsageLogList;
