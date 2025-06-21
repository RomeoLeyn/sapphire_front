import {
  CalendarCheck2,
  CalendarRange,
  Crown,
  Eye,
  EyeOff,
  KeyRound,
  Save,
  User,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { DetailsUserInfo } from "../../types";
import {
  getEmployeePosition,
  getEmployeeRole,
  getEmployeeStatus,
} from "../../utils/utils";
import EditableField from "./EditableField";
import ReadOnlyField from "./ReadOnlyField";
import Modal from "../Common/Modal/Modal";

interface UserProfileInfoProps {
  user: DetailsUserInfo;
  onUpdate: (
    employee: Pick<
      DetailsUserInfo,
      "fullName" | "email" | "username" | "phoneNumber"
    >
  ) => void;
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

const UserProfileInfo: React.FC<UserProfileInfoProps> = ({
  user,
  onUpdate,
}) => {
  const [formData, setFormData] = useState(user);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFieldChange = (
    field: keyof DetailsUserInfo,
    newValue: string
  ) => {
    setFormData({ ...formData, [field]: newValue });
    setButtonStatus(true);
  };

  const handleCancel = () => {
    setFormData(user);
    setButtonStatus(false);
  };

  const statusBadge = STATUS_BADGES[user.status];

  const badgeColor =
    tailwindColorMap[statusBadge.color as keyof typeof tailwindColorMap];

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-3 space-y-4">
      <div className="flex flex-wrap-reverse justify-between items-center gap-y-3">
        <div className="inline-flex w-full sm:w-auto p-3 rounded-full items-center gap-3 bg-gray-200">
          {user.role === "ADMIN" ? (
            <Crown
              className="p-3 bg-white text-yellow-700 rounded-full"
              size={50}
            />
          ) : (
            <User
              className="p-3 bg-white text-gray-700 rounded-full"
              size={50}
            />
          )}{" "}
          <h2 className="text-2xl font-semibold text-gray-800 pr-3">
            Профіль користувача
          </h2>
        </div>

        <div className="lg:order-none lg:w-auto flex justify-end items-start">
          <span
            className={`px-4 py-1 rounded-full text-md font-bold border-2 ${badgeColor?.border} ${badgeColor?.text} ${badgeColor?.bg}`}
          >
            {statusBadge.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-2 gap-x-6 sm:grid-cols-2">
        <div>
          <EditableField
            label="Повне ім'я"
            value={formData.fullName}
            onChange={(val) => handleFieldChange("fullName", val)}
          />
          <EditableField
            label="Username"
            value={formData.username}
            onChange={(val) => handleFieldChange("username", val)}
          />
        </div>
        <div>
          <EditableField
            label="Email"
            value={formData.email}
            onChange={(val) => handleFieldChange("email", val)}
          />
          <EditableField
            label="Номер телефону"
            value={formData.phoneNumber}
            onChange={(val) => handleFieldChange("phoneNumber", val)}
          />
        </div>

        <div className="sm:col-span-2">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            <KeyRound size={24} />
            Змінити Пароль
          </button>
        </div>
        <div>
          <ReadOnlyField
            label="Посада"
            value={getEmployeePosition(formData.position)}
          />
          <ReadOnlyField label="Роль" value={getEmployeeRole(formData.role)} />
          <ReadOnlyField
            label="Статус"
            value={getEmployeeStatus(formData.status)}
          />
        </div>

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
                  alert("Підтверджено!");
                  setIsModalOpen(false);
                }}
              >
                Змінити
              </button>
            </>
          }
        >
          <div className="space-y-6 my-2 overflow-y-auto">
            <div className="relative">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Старий пароль
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                name="oldPassword"
                placeholder="Введіть старий пароль"
                className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring focus:ring-gray-200 transition-all duration-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="p-1 absolute bottom-1 right-1 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showOldPassword ? (
                  <EyeOff className="w-6 h-6" />
                ) : (
                  <Eye className="w-6 h-6" />
                )}
              </button>
            </div>

            <div className="relative">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Новий пароль
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Введіть новий пароль"
                className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring focus:ring-gray-200 transition-all duration-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="p-1 absolute bottom-1 right-1 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <EyeOff className="w-6 h-6" />
                ) : (
                  <Eye className="w-6 h-6" />
                )}
              </button>
            </div>

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Підтвердити пароль
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Повторіть новий пароль"
                className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring focus:ring-gray-200 transition-all duration-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="p-1 absolute bottom-1 right-1 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-6 h-6" />
                ) : (
                  <Eye className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </Modal>

        <div className="flex justify-between flex-wrap gap-y-3 sm:col-span-2">
          <div className="inline-flex sm:col-span-4 flex-col gap-3">
            <div className="inline-flex flex-col gap-1">
              <span className="font-medium">Створено:</span>
              <span className="inline-flex items-center gap-2 text-lg font-medium">
                <CalendarCheck2 size={24} />
                {new Date(user.createdAt).toLocaleString()}
              </span>
            </div>
            {user.updatedAt !== user.createdAt && (
              <div className="inline-flex flex-col gap-1">
                <span className="font-medium">Востаннє змінено:</span>
                <span className="inline-flex items-center gap-2 text-lg font-medium">
                  <CalendarRange size={24} />
                  {new Date(user.updatedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
          {buttonStatus && (
            <div className="inline-flex items-end space-x-4">
              <button
                onClick={handleCancel}
                type="button"
                className="inline-flex items-center gap-2 rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 transition-all duration-200"
              >
                <XCircle size={24} />
                Скасувати
              </button>
              <button
                onClick={() => onUpdate(user.id, formData)}
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:opacity-50 transition-all duration-200"
              >
                <Save size={24} />
                Зберегти
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
