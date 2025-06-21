import React, { useEffect, useState } from "react";
import {
  Boxes,
  Droplet,
  Edit,
  HandCoins,
  PackageOpen,
  Scissors,
  Search,
  Send,
  Sparkles,
  Star,
  Trash2,
  Wallet,
} from "lucide-react";
import { categories, Material, SupplierBrief } from "../../types";
import { getUnit } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getBriefSuppliers } from "../../services/supplierService";
import { toast } from "react-toastify";
import SortPanel from "../Common/SortPanel/SortPanel";
import Modal from "../Common/Modal/Modal";

interface MaterialListProps {
  materials: Material[];
  totalPages?: number;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  onFilterChange: (filters: { supplierId?: number; category?: string }) => void;
}

const categoryStyles: Record<
  string,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
  }
> = {
  TOOLS: {
    label: "Інструменти",
    color: "blue",
    icon: <HandCoins className="w-5 h-5" />,
  },
  HAIR_CARE: {
    label: "Догляд за волоссям",
    color: "green",
    icon: <Scissors className="w-5 h-5" />,
  },
  NAIL_CARE: {
    label: "Догляд за нігтями",
    color: "pink",
    icon: <Sparkles className="w-5 h-5" />,
  },
  SKIN_CARE: {
    label: "Догляд за шкірою",
    color: "yellow",
    icon: <Droplet className="w-5 h-5" />,
  },
  OTHER: {
    label: "Інше",
    color: "gray",
    icon: <Boxes className="w-5 h-5" />,
  },
};

const tailwindColorMap: Record<
  "blue" | "green" | "pink" | "yellow" | "gray",
  {
    border: string;
    text: string;
    bg: string;
  }
> = {
  blue: {
    border: "border-blue-700",
    text: "text-blue-700",
    bg: "bg-blue-100",
  },
  green: {
    border: "border-green-700",
    text: "text-green-700",
    bg: "bg-green-100",
  },
  pink: {
    border: "border-pink-700",
    text: "text-pink-700",
    bg: "bg-pink-100",
  },
  yellow: {
    border: "border-yellow-700",
    text: "text-yellow-700",
    bg: "bg-yellow-100",
  },
  gray: {
    border: "border-gray-700",
    text: "text-gray-700",
    bg: "bg-gray-100",
  },
};

const MaterialList: React.FC<MaterialListProps> = ({
  materials,
  onEdit,
  onDelete,
  onFilterChange,
}) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [suppliers, setSuppliers] = useState<SupplierBrief[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | "">("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const sortFields = [
    { value: "quantity", label: "Ємністю" },
    { value: "price", label: "Ціною" },
    { value: "amount", label: "Кількістю" },
  ];

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortOrder(direction);
  };

  useEffect(() => {
    const fetchBriefSuppliers = async () => {
      try {
        const response = await getBriefSuppliers();
        setSuppliers(response);
      } catch (error) {
        toast.error("Не вдалося отримати список постачальників");
        console.error("Error fetching suppliers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBriefSuppliers();
  }, []);

  useEffect(() => {
    onFilterChange({
      supplierId: selectedSupplierId === "" ? undefined : selectedSupplierId,
      category: categoryFilter || undefined,
    });
  }, [selectedSupplierId, categoryFilter]);

  const searchTerms = search.toLowerCase().split(" ").filter(Boolean);
  const filteredMaterials = materials
    .filter((m) => {
      const materialName = m.name.toLowerCase();
      const supplierNames = m.suppliers.map((s) => s.name.toLowerCase());

      const matchesSearch = searchTerms.every(
        (term) =>
          supplierNames.some((supplierName) => supplierName.includes(term)) ||
          materialName.includes(term)
      );

      return matchesSearch;
    })
    .slice()
    .sort((a, b) => {
      const valueA = a[sortField as keyof Material];
      const valueB = b[sortField as keyof Material];

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });

  const handleOrderClick = (material: Material) => {
    navigate(`/order/${material.id}`, { state: { material } });
  };

  const handleDeleteMaterial = () => {
    onDelete(selectedMaterial);
    setIsDeleteModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <div className="flex flex-wrap flex-col justify-start gap-4">
        <div className="flex justify-start gap-4 sm:flex-nowrap flex-wrap">
          <select
            className="px-4 py-2 border-2 w-full sm:w-1/2 border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Всі категорії</option>
            {categories.map((category) => (
              <option key={category} value={category} className={``}>
                {categoryStyles[category].label}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 w-full sm:w-1/2 border-2 border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
            value={selectedSupplierId}
            onChange={(e) =>
              setSelectedSupplierId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          >
            <option value="">Всі постачальники</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier?.name} | {supplier?.rating}⭐️
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

      <ul className="space-y-4 block">
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Видалення матеріалу"
          footer={
            <>
              <button
                className="px-4 py-2 border-2 border-blue-700 rounded-lg text-blue-700 font-semibold hover:bg-gray-300 transition-all"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Скасувати
              </button>
              <button
                className="px-4 py-2 bg-blue-700 font-semibold text-white rounded-lg hover:bg-blue-600 transition-all"
                onClick={handleDeleteMaterial}
              >
                Видалити
              </button>
            </>
          }
        >
          <div className="flex flex-col items-center text-center space-y-4 my-2">
            <div className="flex items-center gap-3 text-blue-700">
              <Trash2 size={42} />
              <h3 className="text-lg font-bold text-gray-800">
                Ви впевнені, що хочете видалити даний матеріал?
              </h3>
            </div>

            <p className="text-md font-semibold text-gray-700">
              Цю дію{" "}
              <span className="font-bold text-gray-900">
                неможливо скасувати
              </span>
              . Матеріал буде остаточно видалено з системи.
            </p>
          </div>
        </Modal>

        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => {
            const categoryData = categoryStyles[material.category];
            const colorClasses =
              tailwindColorMap[
                categoryData.color as keyof typeof tailwindColorMap
              ];

            return (
              <li
                key={material.id}
                className={`block border-l-4 ${colorClasses.border} bg-gray-200 rounded-xl p-5 hover:shadow-md transition`}
              >
                <div className="flex flex-col justify-between space-y-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    {material.name} ({material.quantity}{" "}
                    {getUnit(material.unit)})
                    <span
                      className={`inline-flex items-center gap-2 border-2 ${colorClasses.border} ${colorClasses.text} ${colorClasses.bg} border-2 px-3 py-1 ml-4 text-sm rounded-full font-semibold`}
                    >
                      {categoryData.icon}
                      {categoryData.label}
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500 font-semibold">
                    {material.description}
                  </p>
                  <p className="text-sm text-gray-500"></p>
                  <p className="text-sm font-semibold text-gray-800 inline-flex items-center gap-2">
                    <Wallet className="w-7 h-7" />{" "}
                    <span className="text-xl p-0">
                      {material.price.toFixed(2)} грн
                    </span>
                    (1 шт.)
                  </p>
                  <div>
                    <p className="text-sm text-gray-700 font-semibold">
                      Постачальники:
                    </p>
                    <div className="list-none flex flex-wrap gap-4 text-sm text-gray-600 pt-2">
                      {material.suppliers.map((s) => (
                        <div
                          key={s.id}
                          className={`py-2 text-right px-4 font-bold border-l-4 border-r-4 bg-gray-50 rounded-lg ${
                            s.rating <= 2.0
                              ? "border-red-500"
                              : s.rating >= 4.0
                              ? "border-green-500 bg-green-100"
                              : "border-yellow-500"
                          }`}
                        >
                          {s.name}
                          <br />
                          <span className="text-lg inline-flex items-center gap-1">
                            {s.rating}
                            <Star className="w-5 h-5" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="inline-flex">
                      <PackageOpen className="w-10 h-10 pr-2 mr-2 border-r-2 border-gray-900" />
                      <div className="text-lg inline-flex items-center">
                        Залишилось:{" "}
                        <span
                          className={`text-2xl mx-1 px-2 border-2 rounded-md font-medium ${
                            material.amount <= material.minAmountThreshold
                              ? "bg-red-100 text-red-800 border-red-800"
                              : material.amount < material.enoughAmountThreshold
                              ? "bg-yellow-100 text-yellow-800 border-yellow-800"
                              : "bg-green-100 text-green-800 border-green-800"
                          }`}
                        >
                          {material.amount}
                        </span>{" "}
                        шт.
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-x-2">
                        <button
                          className="p-2 inline-flex items-center gap-2 rounded-lg border-2 border-gray-500 bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition"
                          title="Замовити"
                          onClick={() => handleOrderClick(material)}
                        >
                          <Send className="h-5 w-5" />{" "}
                          <span className="hidden lg:inline-block">
                            Замовити
                          </span>
                        </button>
                        <button
                          onClick={() => onEdit(material)}
                          className="p-2 inline-flex items-center gap-2 rounded-lg border-2 border-gray-500 bg-gray-100 text-gray-600 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition"
                          title="Редагувати"
                        >
                          <Edit className="h-5 w-5" />{" "}
                          <span className="hidden lg:inline-block">
                            Редагувати
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setSelectedMaterial(material.id);
                          }}
                          className="p-2 inline-flex items-center gap-2 rounded-lg border-2 border-gray-500 bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition"
                          title="Видалити"
                        >
                          <Trash2 className="h-5 w-5" />{" "}
                          <span className="hidden lg:inline-block">
                            Видалити
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li className="text-center text-gray-500">Матеріалів не знайдено.</li>
        )}
      </ul>
    </div>
  );
};

export default MaterialList;
