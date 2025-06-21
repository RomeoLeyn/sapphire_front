import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Employee } from "../../types";
import { toast } from "react-toastify";
import { Eye, EyeOff, Plus, Save, XCircle } from "lucide-react";
import { ukPhoneRegex } from "../../utils/regex";

interface EmployeeFormProps {
  initialValues?: Partial<Employee>;
  onSubmit: (
    values: Omit<Employee, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
}

const EmployeeSchema = Yup.object().shape({
  username: Yup.string().required("Це поле обов'язкове"),
  fullName: Yup.string().required("Це поле обов'язкове"),
  email: Yup.string()
    .email("Неправильний email")
    .required("Це поле обов'язкове"),
  password: Yup.string()
    .min(6, "Пароль має містити щонайменше 6 символів")
    .required("Це поле обов'язкове"),
  phoneNumber: Yup.string()
    .matches(ukPhoneRegex, "Номер має бути у форматі +380XXXXXXXXX")
    .required("Це поле обов'язкове"),
  position: Yup.string().required("Це поле обов'язкове"),
});

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: initialValues?.username || "",
      fullName: initialValues?.fullName || "",
      email: initialValues?.email || "",
      password: initialValues?.password || "",
      phoneNumber: initialValues?.phoneNumber || "",
      position: initialValues?.position || "",
    },
    validationSchema: EmployeeSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log(values);
        await onSubmit(values);
        toast.success(
          `Співробітника успішно ${initialValues ? "оновлено" : "добавлено"}!`
        );
      } catch (error) {
        toast.error(
          `Не вдалося ${initialValues ? "оновити" : "добавити"} співробітника!`
        );
        console.error(
          `Error ${initialValues ? "updating" : "creating"} employee:`,
          error
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="relative bg-gray-50 p-6 rounded-xl border-2 border-gray-200 max-w-full">
      <button
        className="absolute border-2 border-gray-300 p-1 rounded-xl right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-300 transition duration-150"
        onClick={onCancel}
      >
        <Plus className="w-7 h-7 rotate-45 transition duration-150" />
      </button>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {initialValues ? "Оновити співробітника" : "Новий співробітник"}
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.username && formik.errors.username ? (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.username}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Повне ім'я
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.fullName && formik.errors.fullName ? (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.fullName}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.email}
              </p>
            ) : null}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Пароль
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="p-1 absolute bottom-1 right-1 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </button>
            {formik.touched.password && formik.errors.password ? (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.password}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Номер телефону
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.phoneNumber}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Посада
            </label>
            <select
              id="position"
              name="position"
              value={formik.values.position}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            >
              <option value="">– – –</option>
              <option key="head_care" value="ADMIN">
                Адміністратор
              </option>
              <option key="nail_care" value="MANAGER">
                Менеджер
              </option>
              <option key="skin_care" value="TRAINEE">
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
              <option key="makeup_artist" value="MAKEUP_ARTIST">
                Візажист
              </option>
              <option key="masseur" value="MASSEUR">
                Масажист
              </option>
              <option key="nail_technican" value="NAIL_TECHNICIAN">
                Майстер манікюру
              </option>
              <option key="cosmoetologist" value="COSMETOLOGIST">
                Косметолог
              </option>
              <option key="receptionist" value="RECEPTIONIST">
                Секретар
              </option>
              <option key="cleaner" value="CLEANER">
                Прибиральник
              </option>
            </select>
            {formik.touched.position && formik.errors.position && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.position}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 transition-all duration-200"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Скасувати
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting || loading}
            className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? "Збереження..." : initialValues ? "Оновити" : "Добавити"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
