import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoadMoreButtont } from "../components/Common/LoadMoreButton/LoadMoreButton";
import SuppliesForm from "../components/Supplies/SuppliesForm";
import SuppliesList from "../components/Supplies/SuppliesList";
import { useAuth } from "../context/AuthContext";
import { updateIncrementMaterial } from "../services/materialService";
import { updateLastSupplyDate } from "../services/supplierService";
import {
  changeSuppliesStatus,
  createSupplies,
  getSupplies,
  updateSupplies,
} from "../services/suppliesService";
import { MaterialSupply, PaginationResponse } from "../types";

const Supplies: React.FC = () => {
  const [supplies, setSupplies] =
    useState<PaginationResponse<MaterialSupply[]>>();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [selectedSupplies, setSelectedSupplies] =
    useState<MaterialSupply | null>(null);
  const [filters, setFilters] = useState<{
    materialId?: number;
    supplierId?: number;
    status?: string;
  }>({});
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    fetchSupplies();
  }, [page, filters]);

  const fetchSupplies = async () => {
    try {
      const response = await getSupplies(page, filters);
      setSupplies((prev) => {
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
      toast.error("Не вдалося отримати список поставок матеріалів");
      console.error("Error fetching supplies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (
    supplies: Omit<MaterialSupply, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createSupplies(supplies);
      setShowForm(false);
      toast.success("Material deleted successfully");
      fetchSupplies();
    } catch (error) {
      toast.error("Failed to delete material");
      console.error("Error deleting material:", error);
    }
  };

  const handleLoadMore = () => {
    if (hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  const handleConfirm = async (
    suppliesId: string,
    materialId: number,
    supplyId: number,
    increment: number
  ) => {
    try {
      const changeStatus = await changeSuppliesStatus(suppliesId, "CONFIRMED");
      const updateCountMaterials = await updateIncrementMaterial(
        materialId,
        increment
      );
      const updateSupplyDate = await updateLastSupplyDate(supplyId);
      await Promise.all([
        changeStatus,
        updateCountMaterials,
        updateSupplyDate,
      ]).then((results) => {
        console.log(results);
        toast.success("Поставку матеріалу успішно підтверджено");
      });

      await fetchSupplies();
    } catch (error) {
      toast.error("Не вдалося підтвердити поставку матеріалу");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await changeSuppliesStatus(id, "RETURNED");
      toast.warning("Поставку матеріалу повернено постачальнику");
      await fetchSupplies();
    } catch (error) {
      toast.error("Не вдалося повернути поставку матеріалу постачальнику");
    }
  };

  const handleUpdateSupply = async (
    supplies: Omit<MaterialSupply, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedSupplies) return;
    await updateSupplies(selectedSupplies.id, supplies);
    setShowForm(false);
    setSelectedSupplies(null);
    fetchSupplies();
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedSupplies(null);
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
          <SuppliesForm
            initialValues={selectedSupplies || undefined}
            onSubmit={selectedSupplies ? handleUpdateSupply : handleAddSupplier}
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
                Добавити поставку матеріалу
              </button>
            )}
          </div>
          <div>
            <SuppliesList
              supplies={supplies?.content}
              onClickConfirm={handleConfirm}
              onClickReject={handleReject}
              onDelete={handleReject}
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

export default Supplies;
