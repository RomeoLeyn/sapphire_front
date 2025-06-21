import React from "react";
import { Material } from "../../types";
import { getCategory, getUnit } from "../../utils/utils";

interface LowStockMaterialsProps {
  lowStockMaterials: Material[];
}

const LowStockMaterialsTable: React.FC<LowStockMaterialsProps> = ({
  lowStockMaterials,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-red-500 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-50">Залишки матеріалів</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 bg-slate-50 border-gray-200">
          <thead>
            <tr className="text-gray-800 uppercase text-xs tracking-wider">
              <th className="px-6 py-3 text-left">Матеріал</th>
              <th className="px-6 py-3 text-left">Кількість</th>
              <th className="px-6 py-3 text-left">Категорія</th>
              <th className="px-6 py-3 text-left">Місткість</th>
            </tr>
          </thead>
          <tbody>
            {lowStockMaterials.length > 0 ? (
              lowStockMaterials.map((material) => (
                <tr
                  key={material.id}
                  className="border-t border-b border-gray-300 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {material.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.amount} шт.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getCategory(material.category)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.quantity} {getUnit(material.unit)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  Немає матеріалів з низьким запасом
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockMaterialsTable;
