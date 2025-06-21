import {
  Briefcase,
  CalendarCheck2,
  CalendarOff,
  Crown,
  Edit,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Employee, InfoAboutEmployee } from "../../types";
import { getEmployeePosition } from "../../utils/utils";
import Modal from "../Common/Modal/Modal";
import SortPanel from "../Common/SortPanel/SortPanel";

interface EmployeeListProps {
  employees: Employee[];
  handleUpdateInfoAboutEmployee: (
    selectedUserId: string,
    Info: InfoAboutEmployee
  ) => void;
  onFilterChange: (filters: {
    position?: string;
    role?: string;
    status?: string;
  }) => void;
}

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  ACTIVE: {
    label: "Активний",
    color: "green",
  },
  INACTIVE: {
    label: "Тимчасово неактивний",
    color: "red",
  },
  DELETED: {
    label: "Видалений",
    color: "gray",
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

const EmployeesList: React.FC<EmployeeListProps> = ({
  employees,
  handleUpdateInfoAboutEmployee,
  onFilterChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [positionFilter, setPositionFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isModalOpen && selectedUserId) {
      const employee = employees.find((emp) => emp.id === selectedUserId);
      if (employee) {
        setSelectedPosition(employee.position);
        setSelectedRole(employee.role);
        setSelectedStatus(employee.status);
      }
    }
  }, [isModalOpen, selectedUserId, employees]);

  useEffect(() => {
    onFilterChange({
      position: positionFilter || undefined,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
    });
  }, [positionFilter, roleFilter, statusFilter]);

  const sortFields = [
    { value: "createdAt", label: "Добавлено" },
    { value: "updatedAt", label: "Востаннє змінено" },
  ];

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortOrder(direction);
  };

  const searchTerms = search.toLowerCase().split(" ").filter(Boolean);
  const filteredEmployees = employees
    // .filter((e) => e.fullName.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => {
      const employeeFullName = e.fullName.toLowerCase();
      const employeeUsername = e.username.toLowerCase();
      const employeeEmail = e.email.toLowerCase();

      const matchesSearch = searchTerms.every(
        (term) =>
          employeeUsername.includes(term) ||
          employeeFullName.includes(term) ||
          employeeEmail.includes(term)
      );

      return matchesSearch;
    })
    .sort((a, b) => {
      const valueA = a[sortField as keyof Employee];
      const valueB = b[sortField as keyof Employee];

      if (typeof valueA === "string" && typeof valueB === "string") {
        const dateA = new Date(valueA.toString());
        const dateB = new Date(valueB.toString());

        return sortOrder === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      return 0;
    });

  const Info: InfoAboutEmployee = {
    position: selectedPosition,
    role: selectedRole,
    status: selectedStatus,
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <div className="flex flex-wrap flex-col justify-start gap-4">
        <div className="flex justify-start gap-4 sm:flex-nowrap flex-wrap">
          <select
            className="px-4 py-2 border-2 w-full sm:w-1/3 border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="">Всі посади</option>
            <option key="admin" value="ADMIN">
              Адміністратор
            </option>
            <option key="manager" value="MANAGER">
              Менеджер
            </option>
            <option key="trainee" value="TRAINEE">
              Стажер
            </option>
            <option key="hairdresser" value="HAIRDRESSER">
              Перукар
            </option>
            <option key="stylist" value="STYLIST">
              Стиліст
            </option>
            <option key="colorist" value="COLORIST">
              Колорист
            </option>
            <option key="makeupArtist" value="MAKEUP_ARTIST">
              Візажист
            </option>
            <option key="masseur" value="MASSUER">
              Масажист
            </option>
            <option key="nailTechnitian" value="NAIL_TECHNICIAN">
              Майстер манікюру
            </option>
            <option key="cosmetologist" value="COSMETOLOGIST">
              Косметолог
            </option>
            <option key="receptionist" value="RECEPTIONIST">
              Секретар
            </option>
            <option key="cleaner" value="CLEANER">
              Прибиральник
            </option>
          </select>

          <select
            className="px-4 py-2 border-2 w-full sm:w-1/3 border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Всі ролі</option>
            <option key="admin" value="ADMIN">
              Адміністратор
            </option>
            <option key="employee" value="EMPLOYEE">
              Співробітник
            </option>
          </select>

          <select
            className="px-4 py-2 border-2 w-full sm:w-1/3 border-gray-300 rounded-lg bg-gray-50 active:border-gray-700 focus:border-gray-700 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Всі статуси</option>
            <option key="active" value="ACTIVE">
              Активний
            </option>
            <option key="inactive" value="INACTIVE">
              Тимчасово неактивний
            </option>
            <option key="deleted" value="DELETED">
              Видалений
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
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Змінити дані співробітника"
          footer={
            <>
              <button
                className="px-4 py-2 border-2 border-blue-700 rounded-lg text-blue-700 font-semibold hover:bg-gray-300 transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                Скасувати
              </button>
              <button
                className="px-4 py-2 bg-blue-700 font-semibold text-white rounded-lg hover:bg-blue-600 transition-all"
                onClick={() => {
                  handleUpdateInfoAboutEmployee(selectedUserId, Info);
                  setIsModalOpen(false);
                }}
              >
                Підтвердити
              </button>
            </>
          }
        >
          <div className="space-y-6 overflow-y-auto">
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Посада
              </label>
              <div className="flex gap-x-4 gap-y-2 flex-wrap">
                <label key="admin" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioAdmin"
                    value="ADMIN"
                    className="accent-blue-700"
                    checked={selectedPosition === "ADMIN"}
                    onChange={() => setSelectedPosition("ADMIN")}
                  />
                  <span>Адміністратор</span>
                </label>
                <label key="manager" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioManager"
                    value="MANAGER"
                    className="accent-blue-700"
                    checked={selectedPosition === "MANAGER"}
                    onChange={() => setSelectedPosition("MANAGER")}
                  />
                  <span>Менеджер</span>
                </label>
                <label key="trainee" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioTrainee"
                    value="TRAINEE"
                    className="accent-blue-700"
                    checked={selectedPosition === "TRAINEE"}
                    onChange={() => setSelectedPosition("TRAINEE")}
                  />
                  <span>Стажер</span>
                </label>
                <label key="hairdresser" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioHairdresser"
                    value="HAIRDRESSER"
                    className="accent-blue-700"
                    checked={selectedPosition === "HAIRDRESSER"}
                    onChange={() => setSelectedPosition("HAIRDRESSER")}
                  />
                  <span>Перукар</span>
                </label>
                <label key="stylist" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioStylist"
                    value="STYLIST"
                    className="accent-blue-700"
                    checked={selectedPosition === "STYLIST"}
                    onChange={() => setSelectedPosition("STYLIST")}
                  />
                  <span>Стиліст</span>
                </label>
                <label key="colorist" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioColorist"
                    value="COLORIST"
                    className="accent-blue-700"
                    checked={selectedPosition === "COLORIST"}
                    onChange={() => setSelectedPosition("COLORIST")}
                  />
                  <span>Колорист</span>
                </label>

                <label key="makeupArtist" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioMakeupArtist"
                    value="MAKEUPARTIST"
                    className="accent-blue-700"
                    checked={selectedPosition === "MAKEUPARTIST"}
                    onChange={() => setSelectedPosition("MAKEUPARTIST")}
                  />
                  <span>Візажист</span>
                </label>
                <label key="masseur" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioMasseur"
                    value="MASSEUR"
                    className="accent-blue-700"
                    checked={selectedPosition === "MASSEUR"}
                    onChange={() => setSelectedPosition("MASSEUR")}
                  />
                  <span>Масажист</span>
                </label>
                <label key="nailTechnitian" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioNailTechnitian"
                    value="NAIL_TECHNICIAN"
                    className="accent-blue-700"
                    checked={selectedPosition === "NAIL_TECHNICIAN"}
                    onChange={() => setSelectedPosition("NAIL_TECHNICIAN")}
                  />
                  <span>Майстер манікюру</span>
                </label>
                <label key="cosmetologist" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioCosmetologist"
                    value="COSMETOLOGIST"
                    className="accent-blue-700"
                    checked={selectedPosition === "COSMETOLOGIST"}
                    onChange={() => setSelectedPosition("COSMETOLOGIST")}
                  />
                  <span>Косметолог</span>
                </label>
                <label key="receptionist" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioReceptionist"
                    value="RECEPTIONIST"
                    className="accent-blue-700"
                    checked={selectedPosition === "RECEPTIONIST"}
                    onChange={() => setSelectedPosition("RECEPTIONIST")}
                  />
                  <span>Секретар</span>
                </label>
                <label key="cleaner" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioCleaner"
                    value="CLEANER"
                    className="accent-blue-700"
                    checked={selectedPosition === "CLEANER"}
                    onChange={() => setSelectedPosition("CLEANER")}
                  />
                  <span>Прибиральник</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Роль
              </label>
              <div className="flex gap-x-4 gap-y-2 flex-wrap">
                <label key="admin" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioAdmin"
                    value="ADMIN"
                    className="accent-blue-700"
                    checked={selectedRole === "ADMIN"}
                    onChange={() => setSelectedRole("ADMIN")}
                  />
                  <span>Адміністратор</span>
                </label>
                <label key="employee" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioEmplooyee"
                    value="EMPLOYEE"
                    className="accent-blue-700"
                    checked={selectedRole === "EMPLOYEE"}
                    onChange={() => setSelectedRole("EMPLOYEE")}
                  />
                  <span>Співробітник</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <div className="flex gap-x-4 gap-y-2 flex-wrap">
                <label key="active" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioActive"
                    value="ACTIVE"
                    className="accent-blue-700"
                    checked={selectedStatus === "ACTIVE"}
                    onChange={() => setSelectedStatus("ACTIVE")}
                  />
                  <span>Активний</span>
                </label>
                <label key="inactive" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioInactive"
                    value="INACTIVE"
                    className="accent-blue-700"
                    checked={selectedStatus === "INACTIVE"}
                    onChange={() => setSelectedStatus("INACTIVE")}
                  />
                  <span>Неактивний</span>
                </label>
                <label key="deleted" className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="radioDeleted"
                    value="DELETED"
                    className="accent-blue-700"
                    checked={selectedStatus === "DELETED"}
                    onChange={() => setSelectedStatus("DELETED")}
                  />
                  <span>Видалений</span>
                </label>
              </div>
            </div>
          </div>
        </Modal>

        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => {
            const statusBadge = STATUS_BADGES[employee.status];

            const badgeColors =
              tailwindColorMap[
                statusBadge.color as keyof typeof tailwindColorMap
              ];

            return (
              <li
                key={employee.id}
                className={`block border-l-4 bg-gray-200 rounded-xl p-5 hover:shadow-md transition ${badgeColors.border}`}
              >
                <div className="flex flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex flex-col justify-center space-y-2">
                      <div className="inline-flex items-center gap-2">
                        {employee.role === "ADMIN" ? (
                          <div
                            className="text-yellow-700 bg-yellow-300 border-2 border-yellow-700 p-1 rounded-md"
                            title="Адміністратор"
                          >
                            <Crown className="w-10 h-10" />
                          </div>
                        ) : (
                          <div
                            className="text-gray-700 bg-gray-50 border-2 border-gray-700 p-1 rounded-md"
                            title="Робітник"
                          >
                            <User className="w-10 h-10" />
                          </div>
                        )}
                        <div className="inline-flex flex-col justify-between items-start gap-0">
                          <span
                            className={`text-2xl font-bold ${
                              employee.status === "DELETED" && "line-through"
                            }`}
                          >
                            {employee.fullName}
                          </span>
                          <span className="text-md font-semibold italic underline">
                            {employee.username}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex flex-1 flex-col items-start justify-start gap-1">
                          <p className="text-md text-gray-700 font-semibold">
                            Посада:
                          </p>
                          <div
                            className={`bg-gray-50 rounded-lg p-3 w-full lg:order-none lg:w-auto shadow-sm flex flex-col gap-3`}
                          >
                            <div className="flex justify-between items-center ">
                              <span className="inline-flex items-center gap-3 text-lg font-bold">
                                <Briefcase className="w-7 h-7" />
                                {getEmployeePosition(employee.position)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="order-[-1] w-full lg:order-none lg:w-auto flex justify-end items-start">
                    <span
                      className={`px-4 py-1 rounded-full text-md font-bold border-2 ${badgeColors?.border} ${badgeColors?.text} ${badgeColors?.bg}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 text-md text-gray-700 mt-3">
                  <div className="inline-flex flex-col gap-2">
                    <span className="font-medium">Контакти:</span>
                    <span className="inline-flex items-center gap-2 text-lg font-medium">
                      <Mail className="w-7 h-7" />
                      {employee.email}
                    </span>
                    <span className="inline-flex items-center gap-2 text-lg font-medium">
                      <Phone className="w-7 h-7" />
                      {employee.phoneNumber}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="inline-flex flex-col gap-2">
                      <div className="inline-flex flex-col gap-1">
                        <span className="font-medium">Добавлено:</span>
                        <span className="inline-flex items-center gap-2 text-lg font-medium">
                          <CalendarCheck2 className="w-7 h-7" />
                          {new Date(employee.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {employee.updatedAt !== employee.createdAt && (
                        <div className="inline-flex flex-col gap-1">
                          <span className="font-medium">Востаннє змінено:</span>
                          <span className="inline-flex items-center gap-2 text-lg font-medium">
                            <CalendarOff className="w-7 h-7" />
                            {new Date(employee.updatedAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center ml-auto gap-x-2">
                      <button
                        onClick={() => {
                          setSelectedUserId(employee.id);
                          setIsModalOpen(true);
                        }}
                        className="p-2 inline-flex items-center gap-2 rounded-lg border-2 border-gray-500 bg-gray-100 text-gray-600 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition"
                        title="Редагувати"
                      >
                        <Edit className="h-5 w-5" />{" "}
                        <span className="hidden lg:inline-block">
                          Редагувати
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
            No employees found. Add some employees to get started.
          </li>
        )}
      </ul>
    </div>
  );
};

export default EmployeesList;
