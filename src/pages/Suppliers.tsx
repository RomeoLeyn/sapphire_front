import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import SupplierForm from "../components/Suppliers/SupplierForm";
import { PaginationResponse, Supplier } from "../types";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/supplierService";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { SupplierList } from "../components/Suppliers/SupplierLists";
import { LoadMoreButtont } from "../components/Common/LoadMoreButton/LoadMoreButton";

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<PaginationResponse<Supplier[]>>();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [filters, setFilters] = useState<{
    materialId?: number;
  }>({});

  const { isAdmin } = useAuth();

  const fetchSuppliers = async () => {
    try {
      const response = await getSuppliers(page, filters);
      setSuppliers((prev) => {
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
      toast.error("Не вдалося отримати список постачальників");
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (
    supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">
  ) => {
    await createSupplier(supplier);
    setShowForm(false);
    fetchSuppliers();
  };

  const handleUpdateSupplier = async (
    supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedSupplier) return;
    await updateSupplier(selectedSupplier.id, supplier);
    setShowForm(false);
    setSelectedSupplier(null);
    fetchSuppliers();
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      await deleteSupplier(id);
      toast.success("Постачальника успішно видалено");
      fetchSuppliers();
    } catch (error) {
      toast.error("Не вдалося видалити постачальника");
      console.error("Error deleting supplier:", error);
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedSupplier(null);
  };

  const handleLoadMore = () => {
    if (hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    fetchSuppliers();
  }, [isAdmin, page, filters]);

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
          <SupplierForm
            initialValues={selectedSupplier || undefined}
            onSubmit={
              selectedSupplier ? handleUpdateSupplier : handleAddSupplier
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
                Добавити постачальника
              </button>
            )}
          </div>
          <div>
            <SupplierList
              suppliers={suppliers?.content}
              onEdit={handleEditSupplier}
              onDelete={handleDeleteSupplier}
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

export default Suppliers;
