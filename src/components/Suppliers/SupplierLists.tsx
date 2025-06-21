import {
  Boxes,
  Clock,
  Contact2,
  Droplet,
  Edit,
  HandCoins,
  Mail,
  MapPin,
  Package,
  PackageOpen,
  Phone,
  Scissors,
  Search,
  Send,
  Sparkles,
  Star,
  Trash2,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBriefMaterials } from "../../services/materialService";
import { Material, MaterialBrief, Supplier } from "../../types";
import { getCategory, getUnit } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import SortPanel from "../Common/SortPanel/SortPanel";
import Modal from "../Common/Modal/Modal";

interface SupplierListProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  onFilterChange: (filters: { materialId?: number }) => void;
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

export const SupplierList: React.FC<SupplierListProps> = ({
  suppliers,
  onEdit,
  onDelete,
  onFilterChange,
}) => {
  const [materials, setMaterials] = useState<MaterialBrief[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | "">("");
  const [selectedSupplierlId, setSelectedSupplierId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const searchTerms = search.toLowerCase().split(" ").filter(Boolean);
  const filteredSuppliers = suppliers
    .filter((s) => {
      const supplierName = s.name.toLowerCase();

      const matchesSearch = searchTerms.every(
        (term) =>
          // supplierNames.some((supplierName) => supplierName.includes(term)) ||
          supplierName.includes(term)
      );

      return matchesSearch;
    })
    .sort((a, b) => {
      const direction = sortOrder === "asc" ? 1 : -1;

      if (sortField === "rating") {
        return (a.rating - b.rating) * direction;
      }

      if (sortField === "lastSupplyDate") {
        const dateA = new Date(a.lastSupplyDate).getTime();
        const dateB = new Date(b.lastSupplyDate).getTime();
        return (dateB - dateA) * direction;
      }

      return 0;
    });

  const sortFields = [
    { value: "rating", label: "За рейтингом" },
    { value: "lastSupplyDate", label: "Остання поставка" },
  ];

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortOrder(direction);
  };

  const handleOrderClick = (material: Material) => {
    navigate(`/order/${material.id}`, { state: { material } });
  };

  const handleDeleteSupplier = async () => {
    onDelete(selectedSupplierlId);
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
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

    fetchBriefMaterials();
  }, []);

  useEffect(() => {
    onFilterChange({
      materialId: selectedMaterialId === "" ? undefined : selectedMaterialId,
    });
  }, [selectedMaterialId]);

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
            className="px-4 py-2 border-2 w-full border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
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
          title="Видалення постачальника"
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
                onClick={handleDeleteSupplier}
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
                Ви впевнені, що хочете видалити даного постачальника?
              </h3>
            </div>

            <p className="text-md font-semibold text-gray-700">
              Цю дію{" "}
              <span className="font-bold text-gray-900">
                неможливо скасувати
              </span>
              . Постачальника буде остаточно видалено з системи.
            </p>
          </div>
        </Modal>

        {filteredSuppliers.length > 0 ? (
          filteredSuppliers.map((supplier) => (
            <li
              key={supplier.id}
              className={`block border-l-4 bg-gray-200 rounded-xl p-5 hover:shadow-md transition ${
                supplier.rating <= 2.0
                  ? "border-red-500 text-red-700"
                  : supplier.rating >= 4.0
                  ? "border-green-500 text-green-700"
                  : "border-yellow-500 text-yellow-700"
              }`}
            >
              <div className="flex flex-col items-start justify-between gap-4">
                <div className="flex flex-col justify-between space-y-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    {supplier.name} |{" "}
                    <span className="inline-flex items-center gap-1">
                      {supplier.rating}
                      <Star className="w-7 h-7" />
                    </span>
                  </h2>
                  <p className="inline-flex items-center gap-2 text-md text-gray-500">
                    <MapPin className="w-5 h-5" /> {supplier.address}
                  </p>
                </div>

                <div className="flex flex-col gap-2 py-4 border-t border-b border-gray-300">
                  <span className="inline-flex items-center gap-2 text-md text-gray-500">
                    <Mail className="w-5 h-5" /> {supplier.email}
                  </span>
                  <span className="inline-flex items-center gap-2 text-md text-gray-500">
                    <Phone className="w-5 h-5" /> {supplier.phoneNumber}
                  </span>
                  <span className="inline-flex items-center gap-2 text-md text-gray-500">
                    <Contact2 className="w-5 h-5" /> {supplier.contactPerson}
                  </span>
                </div>

                <div className="mb-1 flex items-center flex-wrap gap-1 text-xl text-gray-700">
                  <Package className="w-7 h-7" /> Постачає матеріали:{" "}
                  <span className="text-xl mx-1 px-2 pb-1 border-2 border-gray-700  text-gray-700 rounded-md font-medium">
                    {supplier.materials.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 mt-2">
                {supplier.materials.map((material) => {
                  const categoryData = categoryStyles[material.category];
                  const colorClasses =
                    tailwindColorMap[
                      categoryData.color as keyof typeof tailwindColorMap
                    ];
                  const isLow = material.amount <= material.minAmountThreshold;
                  const isEnough =
                    material.amount >= material.enoughAmountThreshold;

                  const amountColor = isLow
                    ? "text-red-600"
                    : isEnough
                    ? "text-green-600"
                    : "text-gray-600";

                  return (
                    <div
                      key={material.id}
                      className={`bg-gray-50 border-l-4 border-r-4 ${colorClasses.border} rounded-lg p-3 shadow-sm flex flex-col gap-3`}
                    >
                      <div className="flex justify-between items-center ">
                        <h3 className="text-lg font-bold text-gray-700">
                          {material.name} ({material.quantity}{" "}
                          {getUnit(material.unit)})
                        </h3>

                        <span
                          className={`inline-flex items-center gap-2 border-2 ${colorClasses.border} ${colorClasses.text} ${colorClasses.bg} border-2 px-3 py-1 ml-4 text-sm rounded-full font-semibold`}
                        >
                          {categoryData.icon}
                          {categoryData.label}
                        </span>
                      </div>
                      <div className="inline-flex gap-2 items-center text-gray-500">
                        <Wallet className="w-7 h-7" />{" "}
                        <span className="text-lg p-0">
                          {material.price.toFixed(2)} грн
                        </span>
                        (1 шт.)
                      </div>
                      <div className="flex items-center justify-between gap-x-2 text-gray-700">
                        <div className="text-lg inline-flex items-center">
                          <PackageOpen className="w-10 h-10 pr-2 mr-2 border-r-2 border-gray-900" />
                          Залишилось:{" "}
                          <span
                            className={`text-2xl mx-1 px-2 border-2 rounded-md font-medium ${
                              material.amount <= material.minAmountThreshold
                                ? "bg-red-100 text-red-800 border-red-800"
                                : material.amount <
                                  material.enoughAmountThreshold
                                ? "bg-yellow-100 text-yellow-800 border-yellow-800"
                                : "bg-green-100 text-green-800 border-green-800"
                            }`}
                          >
                            {material.amount}
                          </span>{" "}
                          шт.
                        </div>
                        <button
                          className="p-2 inline-flex items-center gap-2 rounded-lg border-2 border-gray-500 bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition"
                          title="Замовити"
                          onClick={() => handleOrderClick(material, supplier)}
                        >
                          <Send className="h-5 w-5" />{" "}
                          <span className="hidden lg:inline-block">
                            Замовити
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap space-y-2 justify-between pt-3">
                {supplier.lastSupplyDate && (
                  <div className="inline-flex items-center text-gray-700">
                    <Clock className="w-7 h-7 mr-2" />
                    <div className="text-lg inline-flex items-center">
                      Дата останньої поставки:{" "}
                      <span
                        className={`text-xl mx-1 border-2 rounded-md font-medium `}
                      >
                        {new Date(supplier.lastSupplyDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center ml-auto gap-x-2">
                  <button
                    onClick={() => onEdit(supplier)}
                    className="p-2 inline-flex items-center gap-2 rounded-lg border-2 border-gray-500 bg-gray-100 text-gray-600 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition"
                    title="Редагувати"
                  >
                    <Edit className="h-5 w-5" />{" "}
                    <span className="hidden lg:inline-block">Редагувати</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setSelectedSupplierId(supplier.id);
                    }}
                    className="p-2 inline-flex items-center gap-2 rounded-lg border-2 border-gray-500 bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition"
                    title="Видалити"
                  >
                    <Trash2 className="h-5 w-5" />{" "}
                    <span className="hidden lg:inline-block">Видалити</span>
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="px-4 py-6 text-center text-gray-500">
            Постачальників не знайдено. Додайте нового, щоб почати.
          </li>
        )}
      </ul>
    </div>
  );
};
