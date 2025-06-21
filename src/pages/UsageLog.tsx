import React, { useState, useEffect, useContext } from "react";
import { Plus } from "lucide-react";
import UsageLogForm from "../components/UsageLog/UsageLogForm";
import {
  CreateMaterialUsage,
  Employee,
  Material,
  MaterialUsage,
  PaginationResponse,
} from "../types";
import {
  getMaterialUsageLog,
  getMaterialUsageLogForEmployee,
  logMaterialUsage,
  updateDecrementMaterial,
} from "../services/materialService";
import { toast } from "react-toastify";
import UsageLogList from "../components/UsageLog/UsageLogList";
import { LoadMoreButtont } from "../components/Common/LoadMoreButton/LoadMoreButton";
import { useAuth } from "../context/AuthContext";
import { ADMIN, EMPLOYEE } from "../constants/constants";

const UsageLog: React.FC = () => {
  const [usageLog, setUsageLog] =
    useState<PaginationResponse<MaterialUsage[]>>();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const { user } = useAuth();
  const [filters, setFilters] = useState<{
    materialId?: number;
    employeeId?: number;
  }>({});

  const fetchUsageLog = async () => {
    try {
      const response = await getMaterialUsageLog(page, filters);
      setUsageLog((prev) => {
        if (!prev || page === 0) return response;
        const prevContent = Array.isArray(prev.content) ? prev.content : [];
        const newContent = Array.isArray(response.content)
          ? response.content
          : [];
        return {
          ...response,
          content: [...prevContent, ...newContent],
        };
      });

      setHasNext(response.hasNext);
    } catch (error) {
      toast.error("Не вдалося отримати список записів про використання");
      console.error("Error fetching usage data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageLogForEmployee = async () => {
    try {
      const response = await getMaterialUsageLogForEmployee(user?.id, page);
      setUsageLog((prev) => {
        if (!prev || page === 0) return response;
        const prevContent = Array.isArray(prev.content) ? prev.content : [];
        const newContent = Array.isArray(response.content)
          ? response.content
          : [];
        return {
          ...response,
          content: [...prevContent, ...newContent],
        };
      });

      setHasNext(response.hasNext);
    } catch (error) {
      toast.error("Не вдалося отримати список записів про використання");
      console.error("Error fetching usage data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === ADMIN) {
      fetchUsageLog();
    } else if (user?.role === EMPLOYEE) {
      fetchUsageLogForEmployee();
    }
  }, [page, filters]);

  const handleLoadMore = () => {
    if (hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  const handleLogUsage = async (
    usage: Omit<
      CreateMaterialUsage,
      "id" | "createdAt" | "materialName" | "employeeName"
    >
  ) => {
    try {
      await logMaterialUsage(usage);
      await updateDecrementMaterial(usage.materialId, usage.amountUsed);
      setShowForm(false);
      setPage(0);
      if (user?.role === ADMIN) {
        await fetchUsageLog();
      } else if (user?.role === EMPLOYEE) {
        await fetchUsageLogForEmployee();
      }
    } catch (err) {
      toast.error("Не вдалося створити запис про використання");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  if (loading && usageLog?.content.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showForm ? (
        <div className="bg-gray-200 rounded-lg">
          <UsageLogForm onSubmit={handleLogUsage} onCancel={handleCancelForm} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-1" />
              Добавити запис про використання
            </button>
          </div>
          <div>
            <UsageLogList
              usageLog={usageLog?.content ?? []}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setPage(0);
              }}
            />
          </div>
          <div>{hasNext && <LoadMoreButtont onClick={handleLoadMore} />}</div>
        </div>
      )}
    </div>
  );
};

export default UsageLog;
