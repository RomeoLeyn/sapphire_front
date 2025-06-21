import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CreateMaterialUsage, EmployeeBrief, MaterialBrief } from "../../types";
import { getBriefMaterials } from "../../services/materialService";
import {
  getBriefEmployees,
  getEmployeeById,
} from "../../services/employeeService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Plus, Save, XCircle } from "lucide-react";
import { getCategory, getEmployeePosition } from "../../utils/utils";
import { ADMIN, EMPLOYEE } from "../../constants/constants";

interface UsageLogFormProps {
  onSubmit: (
    values: Omit<
      CreateMaterialUsage,
      "id" | "createdAt" | "materialName" | "employeeName"
    >
  ) => Promise<void>;
  onCancel: () => void;
}

const UsageLogSchema = Yup.object().shape({
  materialId: Yup.string().required("Це поле обов'язкове"),
  employeeId: Yup.string().required("Це поле обов'язкове"),
  amountUsed: Yup.number()
    .required("Це поле обов'язкове")
    .positive("Це поле не може бути від'ємним"),
  usageDate: Yup.date()
    .required("Це поле обов'язкове")
    .max(new Date(), "Це не може бути використане для майбутніх записів"),
  comment: Yup.string(),
});

const UsageLogForm: React.FC<UsageLogFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [materials, setMaterials] = useState<MaterialBrief[]>([]);
  const [employees, setEmployees] = useState<EmployeeBrief[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materialsData = await getBriefMaterials();
        setMaterials(materialsData);

        if (user?.role === ADMIN) {
          const employeesData = await getBriefEmployees();
          setEmployees(employeesData);
        } else if (user?.role === EMPLOYEE) {
          const response = await getEmployeeById(user.id);
          setEmployees([response]);
        }
      } catch (error) {
        toast.error("Не вдалося отримати список матеріалів та співробітників");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      materialId: initialValues?.material?.id || "",
      employeeId: user?.role === "EMPLOYEE" && user?.id ? user.id : "",
      amountUsed: 0,
      usageDate: new Date().toISOString().split("T")[0],
      comment: "",
    },
    validationSchema: UsageLogSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        const formattedValues = {
          ...values,
          usageDate: new Date(values.usageDate),
        };

        await onSubmit(formattedValues);
        toast.success("Запис про використання успішно створено!");
        resetForm();
      } catch (error) {
        toast.error("Не вдалося створити запис про використання");
        console.error("Error logging usage:", error);
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  const selectedMaterial = materials.find(
    (m) => m.id === formik.values.materialId
  );

  return (
    <div className="relative bg-gray-50 p-6 rounded-xl border-2 border-gray-200 max-w-full">
      <button
        className="absolute border-2 border-gray-300 p-1 rounded-xl right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-300 transition duration-150"
        onClick={onCancel}
      >
        <Plus className="w-7 h-7 rotate-45 transition duration-150" />
      </button>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {initialValues
          ? "Оновити запис про використання"
          : "Новий запис про використання"}
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="materialId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Матеріал
            </label>
            <select
              id="materialId"
              name="materialId"
              value={formik.values.materialId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            >
              <option value="">– – –</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name} | {getCategory(material.category)}
                </option>
              ))}
            </select>
            {formik.touched.materialId && formik.errors.materialId && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.materialId}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="employeeId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Робітник
            </label>
            <select
              id="employeeId"
              name="employeeId"
              value={formik.values.employeeId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            >
              <option value="">– – –</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName} | {getEmployeePosition(employee.position)}
                </option>
              ))}
            </select>
            {formik.touched.employeeId && formik.errors.employeeId && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.employeeId}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="amountUsed"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Використано (шт)
            </label>
            <input
              type="number"
              id="amountUsed"
              name="amountUsed"
              min="0"
              value={formik.values.amountUsed}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.amountUsed && formik.errors.amountUsed && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.amountUsed}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="usageDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Дата
            </label>
            <div>
              <input
                type="date"
                id="usageDate"
                name="usageDate"
                value={formik.values.usageDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                max={new Date().toISOString().split("T")[0]}
              />
              {formik.touched.usageDate && formik.errors.usageDate ? (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.usageDate}
                </p>
              ) : null}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <div className="mt-1">
              <textarea
                id="comment"
                name="comment"
                rows={3}
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              />
              {formik.touched.comment && formik.errors.comment ? (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.comment}
                </p>
              ) : null}
            </div>
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

export default UsageLogForm;
