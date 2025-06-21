import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Material, Supplier } from "../../types";
import { toast } from "react-toastify";
import { Plus, Save, X, XCircle } from "lucide-react";
import { getCategory } from "../../utils/utils";
import { MAX_RATE } from "../../constants/constants";
import { getBriefMaterials } from "../../services/materialService";
import { ukPhoneRegex } from "../../utils/regex";

interface SupplierFormProps {
  initialValues?: Partial<Supplier>;
  onSubmit: (
    values: Omit<Supplier, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
}

const SupplierSchema = Yup.object().shape({
  name: Yup.string().required("Це поле обов'язкове"),
  phoneNumber: Yup.string().matches(ukPhoneRegex, "Номер має бути у форматі +380XXXXXXXXX").required("Це поле обов'язкове"),
  email: Yup.string()
    .email("Неправильний email")
    .required("Це поле обов'язкове"),
  address: Yup.string().min(3).required("Це поле обов'язкове"),
  contactPerson: Yup.string().min(3).required("Це поле обов'язкове"),
  rating: Yup.number().positive("Рейтинг повинен бути цілим числом").required("Це поле обов'язкове"),
  materialIds: Yup.array().of(Yup.number()),
});

const SupplierForm: React.FC<SupplierFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await getBriefMaterials();
        setMaterials(response);
      } catch (error) {
        toast.error("Не вдалося отримати список матеріалів");
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchMaterials();
  }, []);

  useEffect(() => {
    formik.setFieldValue("materialIds", selectedMaterialIds);
  }, [selectedMaterialIds]);

  useEffect(() => {
    if (initialValues?.materials) {
      const supplierIds = initialValues.materials.map((s) => Number(s.id));
      setSelectedMaterialIds(supplierIds);
    }
  }, [initialValues]);

  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || "",
      phoneNumber: initialValues?.phoneNumber || "",
      email: initialValues?.email || "",
      address: initialValues?.address || "",
      contactPerson: initialValues?.contactPerson || "",
      rating: initialValues?.rating || 0,
      materialIds: initialValues?.materials || [],
    },
    validationSchema: SupplierSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSubmit(values);
        toast.success(
          `Постачальника успішно ${initialValues ? "оновлено" : "добавлено"}!`
        );
      } catch (error) {
        toast.error(
          `Не вдалося ${initialValues ? "оновити" : "добавити"} постачальника!`
        );
        console.error(
          `Error ${initialValues ? "updating" : "creating"} supplier:`,
          error
        );
      } finally {
        setSubmitting(false);
        setLoading(false);
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
        {initialValues ? "Оновити постачальника" : "Новий постачальник"}
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Назва компанії
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.name}
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

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Адреса
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.address && formik.errors.address ? (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.address}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="contactPerson"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Контактна особа
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formik.values.contactPerson}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.contactPerson && formik.errors.contactPerson ? (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.contactPerson}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Рейтинг
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              max={MAX_RATE}
              value={formik.values.rating}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.setFieldValue(
                  "rating",
                  parseFloat(parseFloat(e.target.value).toFixed(1)) || 0
                );
              }}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.rating && formik.errors.rating ? (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.rating}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="materialIds"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Матеріали
            </label>
            {selectedMaterialIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedMaterialIds.map((id) => {
                  const material = materials.find((m) => Number(m.id) === id);
                  return (
                    <span
                      key={id}
                      className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {material?.name} | {getCategory(material?.category)}
                      <button
                        type="button"
                        className="ml-2 text-blue-500 hover:text-red-600"
                        onClick={() =>
                          setSelectedMaterialIds((prev) =>
                            prev.filter((materialId) => materialId !== id)
                          )
                        }
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            <select
              id="materialIds"
              name="materialIds"
              value=""
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                if (!selectedMaterialIds.includes(selectedId)) {
                  setSelectedMaterialIds([...selectedMaterialIds, selectedId]);
                }
              }}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            >
              <option value="">– – –</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name} | {getCategory(material?.category)}
                </option>
              ))}
            </select>
            {formik.touched.materialIds && formik.errors.materialIds && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.materialIds}
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

export default SupplierForm;
