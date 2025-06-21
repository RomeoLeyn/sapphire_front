import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getSuppliersByMaterialId } from "../../services/supplierService";
import { createSupplies } from "../../services/suppliesService";
import { Material, MaterialSupply, SupplierBrief } from "../../types";
import SuppliesForm from "./SuppliesForm";

const SupplyFormRouteWrapper: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierBrief[]>([]);
  const [material, setMaterial] = useState<Material | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      const materialFromState = location.state?.material as Material;
      if (materialFromState) {
        setLoading(true);
        try {
          setMaterial(materialFromState);
          const response = await getSuppliersByMaterialId(materialFromState.id);
          setSuppliers(response);
        } catch (err) {
          toast.error("Не вдалося отримати список постачальників");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSuppliers();
  }, [location.state]);

  const handleSubmit = async (
    supplies: Omit<MaterialSupply, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createSupplies(supplies);
      setShowForm(false);
      navigate("/supplies");
    } catch (error) {
      toast.error("Не вдалося видалити матеріал");
      console.error("Error deleting material:", error);
    }
  };

  const handleCancelForm = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <SuppliesForm
      materialId={material?.id}
      suppliersId={suppliers}
      onSubmit={handleSubmit}
      onCancel={handleCancelForm}
    />
  );
};

export default SupplyFormRouteWrapper;
