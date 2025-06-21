import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoadMoreButtont } from "../components/Common/LoadMoreButton/LoadMoreButton";
import EmployeeForm from "../components/Employees/EmployeeForm";
import EmployeesList from "../components/Employees/EmployeesList";
import { useAuth } from "../context/AuthContext";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  updateInfoAboutEmployee,
} from "../services/employeeService";
import { Employee, InfoAboutEmployee, PaginationResponse } from "../types";

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<PaginationResponse<Employee[]>>();
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [filters, setFilters] = useState<{
    position?: string;
    role?: string;
    status?: string;
  }>({});
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    fetchEmployees();
  }, [page, filters]);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees(page, filters);
      setEmployees((prev) => {
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
      toast.error("Не вдалося отримати список співробітників");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (
    employee: Omit<Employee, "id" | "createdAt" | "updatedAt">
  ) => {
    await createEmployee(employee);
    setShowForm(false);
    fetchEmployees();
  };

  const handleUpdateEmployee = async (
    employee: Omit<Employee, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedEmployee) return;
    await updateEmployee(selectedEmployee.id, employee);
    setShowForm(false);
    setSelectedEmployee(null);
    fetchEmployees();
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedEmployee(null);
  };

  const handleLoadMore = () => {
    if (hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  const handleUpdateInfoAboutEmployee = async (
    selectedUserId: string,
    Info: InfoAboutEmployee
  ) => {
    try {
      const response = await updateInfoAboutEmployee(selectedUserId, Info);
      console.log(response);
      await fetchEmployees();
      toast.success("Дані працівника успішно оновлено");
    } catch (error) {
      toast.error("Не вдалося оновити дані працівника");
    }
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

  if (loading) {
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
          <EmployeeForm
            initialValues={selectedEmployee || undefined}
            onSubmit={
              selectedEmployee ? handleUpdateEmployee : handleAddEmployee
            }
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition-all"
              >
                <Plus className="h-4 w-4 mr-1" />
                Добавити співробітника
              </button>
            )}
          </div>
          <div>
            <EmployeesList
              employees={employees?.content}
              handleUpdateInfoAboutEmployee={handleUpdateInfoAboutEmployee}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setPage(0);
              }}
            />
          </div>
        </div>
      )}

      {hasNext && <LoadMoreButtont onClick={handleLoadMore} />}
    </div>
  );
};

export default Employees;
