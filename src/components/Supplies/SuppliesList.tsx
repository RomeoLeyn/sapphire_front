import {
  BadgeCheck,
  Ban,
  Boxes,
  CalendarDays,
  Droplet,
  HandCoins,
  NotebookText,
  Package,
  Scissors,
  Search,
  Sparkles,
  Star,
  Truck,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBriefMaterials } from "../../services/materialService";
import { getBriefSuppliers } from "../../services/supplierService";
import { MaterialBrief, MaterialSupply, SupplierBrief } from "../../types";
import { getCategory, getUnit } from "../../utils/utils";
import { SupplyStatus } from "../Common/SuppliesStatus/SupplyStatus";
import SortPanel from "../Common/SortPanel/SortPanel";

interface SuppliesListProps {
  supplies: MaterialSupply[];
  onClickConfirm: (
    id: string,
    materialId: number,
    supplyId: number,
    increment: number
  ) => void;
  onClickReject: (id: string) => void;
  onFilterChange: (filters: {
    materialId?: number;
    supplierId?: number;
    status?: string;
  }) => void;
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
  "blue" | "green" | "pink" | "yellow" | "red" | "gray",
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
    border: "border-yellow-600",
    text: "text-yellow-700",
    bg: "bg-yellow-100",
  },
  red: {
    border: "border-red-700",
    text: "text-red-700",
    bg: "bg-red-100",
  },
  gray: {
    border: "border-gray-700",
    text: "text-gray-700",
    bg: "bg-gray-100",
  },
};

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  PENDING: {
    label: "Очікує підтвердження",
    color: "yellow",
  },
  CONFIRMED: {
    label: "Підтверджено",
    color: "green",
  },
  RETURNED: {
    label: "Повернено",
    color: "red",
  },
};

const SuppliesList: React.FC<SuppliesListProps> = ({
  supplies,
  onClickConfirm,
  onClickReject,
  onFilterChange,
}) => {
  const [materials, setMaterials] = useState<MaterialBrief[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | "">("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | "">("");
  const [suppliers, setSuppliers] = useState<SupplierBrief[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("quantity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [animatingIds, setAnimatingIds] = useState<string[]>([]);

  const [suppliesState, setSuppliesState] =
    useState<MaterialSupply[]>(supplies);

  const sortFields = [
    { value: "amount", label: "Кількість" },
    { value: "totalPrice", label: "Загальна ціна" },
  ];

  useEffect(() => {
    setSuppliesState(supplies);
  }, [supplies]);

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
      materialId: selectedMaterialId === "" ? undefined : selectedMaterialId,
      supplierId: selectedSupplierId === "" ? undefined : selectedSupplierId,
      status: statusFilter || undefined,
    });
  }, [selectedMaterialId, selectedSupplierId, statusFilter]);

  const searchTerms = search.toLowerCase().split(" ").filter(Boolean);
  const filteredMaterials = suppliesState
    .filter((s) => {
      const supplierName = s.supplier.name.toLowerCase();
      const materialName = s.material.name.toLowerCase();

      const matchesSearch = searchTerms.every(
        (term) => supplierName.includes(term) || materialName.includes(term)
      );

      return matchesSearch;
    })
    .sort((a, b) => {
      const direction = sortOrder === "asc" ? 1 : -1;

      if (sortField === "amount") {
        return (a.amount - b.amount) * direction;
      }

      if (sortField === "totalPrice") {
        return (a.amount - b.amount) * direction;
      }

      return 0;
    });

  const handleConfirm = (
    id: string,
    materialId: number,
    supplyId: number,
    increment: number
  ) => {
    setAnimatingIds((prev) => [...prev, id]);

    setTimeout(() => {
      onClickConfirm(id, materialId, supplyId, increment);

      setSuppliesState((prev) =>
        prev.map((supply) =>
          supply.id === id ? { ...supply, status: "CONFIRMED" } : supply
        )
      );

      setAnimatingIds((prev) => prev.filter((itemId) => itemId !== id));
    }, 500);
  };

  const handleReject = (id: string) => {
    setAnimatingIds((prev) => [...prev, id]);

    setTimeout(() => {
      onClickReject(id);
      setSuppliesState((prev) =>
        prev.map((supply) =>
          supply.id === id ? { ...supply, status: "RETURNED" } : supply
        )
      );
    }, 500);
  };

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortOrder(direction);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <div className="flex flex-wrap flex-col justify-start gap-4">
        <div className="flex justify-start gap-4 sm:flex-nowrap flex-wrap">
          <select
            className="px-4 py-2 border-2 w-full sm:w-1/3 border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
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

          <select
            className="px-4 py-2 border-2 w-full sm:w-1/3 border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
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

          <select
            className="px-4 py-2 border-2 w-full sm:w-1/3 border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Всі статуси</option>
            <option key="confirmed" value="CONFIRMED">
              Підтверджено
            </option>
            <option key="pending" value="PENDING">
              Очікує підтвердження
            </option>
            <option key="returned" value="RETURNED">
              Повернено
            </option>
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
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((supply) => {
            const statusBadge = STATUS_BADGES[supply.status];

            const badgeColors =
              tailwindColorMap[
                statusBadge.color as keyof typeof tailwindColorMap
              ];

            const categoryData = categoryStyles[supply.material.category];
            const categoryColors =
              tailwindColorMap[
                categoryData.color as keyof typeof tailwindColorMap
              ];

            return (
              <li
                key={supply.id}
                // className={`block border-l-4 ${badgeColors.border} bg-gray-200 rounded-xl p-5 hover:shadow-md transition`}
                className={`block border-l-4 ${
                  badgeColors.border
                } bg-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-500 ease-in-out transform
    ${
      animatingIds.includes(supply.id)
        ? "opacity-0 scale-95"
        : "opacity-100 scale-100"
    }
  `}
              >
                <div className="flex flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex flex-1 flex-col items-start justify-start gap-1">
                      <p className="text-sm text-gray-700 font-semibold">
                        Матеріал:
                      </p>
                      <div
                        className={`bg-gray-50 rounded-lg p-3 w-full lg:order-none lg:w-auto shadow-sm flex flex-col gap-3`}
                      >
                        <div className="flex justify-between items-center ">
                          <h3 className="text-lg font-bold text-gray-700">
                            {supply.material.name} ({supply.material.quantity}{" "}
                            {getUnit(supply.material.unit)})
                          </h3>

                          <span
                            className={`inline-flex items-center gap-2 border-2 ${categoryColors.border} ${categoryColors.text} ${categoryColors.bg} border-2 px-3 py-1 ml-4 text-sm rounded-full font-semibold`}
                          >
                            {categoryData.icon}
                            {categoryData.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1 mt-2">
                      <p className="text-sm text-gray-700 font-semibold">
                        Постачальник:
                      </p>
                      <div
                        className={`bg-gray-50 w-full lg:order-none lg:w-auto rounded-lg p-3 text-md font-bold flex gap-1 ${
                          supply.supplier.rating <= 2.0
                            ? "text-red-700"
                            : supply.supplier.rating >= 4.0
                            ? "text-green-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {supply.supplier.name} |
                        <span className="text-lg inline-flex items-center gap-1">
                          {supply.supplier.rating}
                          <Star className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <SupplyStatus
                      statusBadge={statusBadge}
                      badgeColors={badgeColors}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-700 mt-2">
                  <div className="inline-flex flex-col gap-1">
                    <span className="font-medium">Кількість:</span>
                    <span className="inline-flex items-center gap-1 text-lg font-bold">
                      <Package className="w-7 h-7" />
                      {supply.amount} шт.
                    </span>
                  </div>

                  <div className="inline-flex flex-col gap-1">
                    <span className="font-medium">Загальна ціна:</span>
                    <span className="inline-flex items-center gap-1 text-lg font-bold">
                      <Wallet className="w-7 h-7" />
                      {supply.totalPrice.toFixed(2)} грн.
                    </span>
                  </div>
                  <div className="inline-flex flex-col gap-1">
                    <span className="font-medium">Замовлено:</span>
                    <span className="inline-flex items-center gap-1 text-lg font-bold">
                      <CalendarDays className="w-7 h-7" />
                      {new Date(supply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="inline-flex flex-col gap-1">
                    <span className="font-medium">Очікується:</span>
                    <span className="inline-flex items-center gap-1 text-lg font-bold">
                      <Truck className="w-7 h-7" />
                      {new Date(supply.supplyDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between flex-wrap items-end gap-4 pt-2">
                    <div className="inline-flex">
                      {supply.note && (
                        <div className="flex items-center gap-2 col-span-full">
                          <div className="flex-shrink-0 w-10 h-10 pr-2 border-r-2 border-gray-700 flex items-center justify-center">
                            <NotebookText className="w-10 h-10" />
                          </div>
                          <span className="text-md italic font-semibold break-words whitespace-normal flex-1">
                            {supply.note}
                          </span>
                        </div>
                      )}
                    </div>
                    {supply.status !== "CONFIRMED" &&
                      supply.status !== "RETURNED" && (
                        <div className="flex items-center gap-x-2">
                          <button
                            onClick={() =>
                              handleConfirm(
                                supply.id,
                                supply.material.id,
                                supply.supplier.id,
                                supply.amount
                              )
                            }
                            className="p-2 inline-flex items-center gap-2 rounded-lg border-2 border-green-700 bg-green-100 text-green-700 hover:bg-green-700 hover:text-white transition"
                            title="Підтвердити поставку"
                          >
                            <BadgeCheck className="h-5 w-5" />
                            <span className="font-semibold">Підтвердити</span>
                          </button>
                          <button
                            onClick={() => handleReject(supply.id)}
                            className="p-2 inline-flex items-center gap-2 rounded-lg border-2 border-red-700 bg-red-100 text-red-700 hover:bg-red-700 hover:text-white transition"
                            title="Відхилити та повернути поставку"
                          >
                            <Ban className="h-5 w-5" />
                            <span className="font-semibold">Повернути</span>
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li className="px-4 py-6 text-center text-gray-500">
            Поставок матеріалів не знайдено. Замовте нову поставку, щоб почати.
          </li>
        )}
      </ul>
    </div>
  );
};

export default SuppliesList;
