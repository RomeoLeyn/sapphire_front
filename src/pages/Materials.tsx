import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import MaterialList from "../components/Materials/MaterialList";
import MaterialForm from "../components/Materials/MaterialForm";
import { Material, PaginationResponse } from "../types";
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "../services/materialService";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { LoadMoreButtont } from "../components/Common/LoadMoreButton/LoadMoreButton";
const Materials: React.FC = () => {
  const [materials, setMaterials] = useState<PaginationResponse<Material[]>>();
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<{
    supplierId?: number;
    category?: string;
  }>({});
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchMaterials();
  }, [page, filters]);

  const fetchMaterials = async () => {
    try {
      const response = await getMaterials(page, filters);
      setMaterials((prev) => {
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
      toast.error("Не вдалося отримати список матеріалів");
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  const handleAddMaterial = async (
    material: Omit<Material, "id" | "createdAt" | "updatedAt">
  ) => {
    await createMaterial(material);
    setShowForm(false);
  };

  const handleUpdateMaterial = async (
    material: Omit<Material, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedMaterial) return;
    await updateMaterial(selectedMaterial.id, material);
    setShowForm(false);
    setSelectedMaterial(null);
    fetchMaterials();
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      await deleteMaterial(id);
      toast.success("Матеріал успішно видалено");
      fetchMaterials();
    } catch (error) {
      toast.error("Не вдалося видалити матеріал");
      console.error("Error deleting material:", error);
    }
  };

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedMaterial(null);
  };

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
          <MaterialForm
            initialValues={selectedMaterial || undefined}
            onSubmit={
              selectedMaterial ? handleUpdateMaterial : handleAddMaterial
            }
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {isAdmin && (
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition-all"
              >
                <Plus className="h-4 w-4 mr-1" />
                Добавити матеріал
              </button>
            </div>
          )}
          <div>
            <MaterialList
              materials={materials?.content}
              onEdit={handleEditMaterial}
              onDelete={handleDeleteMaterial}
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

export default Materials;
