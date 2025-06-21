import React from "react";
import { AlertTriangle } from "lucide-react";
import { Material } from "../../types";
import { useNavigate } from "react-router-dom";

interface LowStockAlertProps {
  materials: Pick<
    Material,
    | "id"
    | "name"
    | "category"
    | "amount"
    | "minAmountThreshold"
    | "enoughAmountThreshold"
  >[];
  threshold?: number;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ materials }) => {
  const navigate = useNavigate();

  const lowStockMaterials = materials.filter(
    (material) => material.amount <= 0
  );

  if (lowStockMaterials.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Матеріали, які закінчились
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {lowStockMaterials.map((material) => (
                <li
                  className="cursor-pointer hover:text-red-900 hover:underline"
                  title="Замовити матеріал"
                  key={material.id}
                  onClick={() =>
                    navigate(`/order/${material.id}`, { state: { material } })
                  }
                >
                  {material.name}: {material.amount} шт.
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert;
