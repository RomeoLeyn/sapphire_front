import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Material, Supplier } from "../../types";
import { getBriefSuppliers } from "../../services/supplierService";
import { toast } from "react-toastify";
import { Plus, Save, X, XCircle } from "lucide-react";

interface MaterialFormProps {
  initialValues?: Partial<Material>;
  onSubmit: (
    values: Omit<Material, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
}

const MaterialSchema = Yup.object().shape({
  name: Yup.string().required("Це поле обов'язкове"),
  category: Yup.string().required("Це поле обов'язкове"),
  description: Yup.string(),
  quantity: Yup.number()
    .required("Це поле обов'язкове")
    .min(0, "Це поле не може бути від'ємним"),
  unit: Yup.string().required("Це поле обов'язкове"),
  amount: Yup.number()
    .required("Це поле обов'язкове")
    .min(0, "Це поле не може бути від'ємним"),
  price: Yup.number()
    .required("Ціна є обов'язковою")
    .moreThan(0, "Ціна повинна бути більшою за 0"),
  minAmountThreshold: Yup.number()
    .required("Це поле обов'язкове")
    .moreThan(0, "Має бути більше 0"),
  enoughAmountThreshold: Yup.number()
    .required("Це поле обов'язкове")
    .moreThan(
      Yup.ref("minAmountThreshold"),
      "Має бути більшим за мінімальний поріг"
    ),
  supplierIds: Yup.array().of(Yup.number()),
});

const MaterialForm: React.FC<MaterialFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await getBriefSuppliers();
        setSuppliers(response);
      } catch (error) {
        toast.error("Не вдалося отримати список постачальників");
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    formik.setFieldValue("supplierIds", selectedSupplierIds);
  }, [selectedSupplierIds]);

  useEffect(() => {
    if (initialValues?.suppliers) {
      const supplierIds = initialValues.suppliers.map((s) => s.id);
      setSelectedSupplierIds(supplierIds);
    }
  }, [initialValues]);

  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      quantity: initialValues?.quantity || 0,
      amount: initialValues?.amount || 0,
      unit: initialValues?.unit || "",
      category: initialValues?.category || "",
      price: initialValues?.price || 0,
      minAmountThreshold: initialValues?.minAmountThreshold || 3,
      enoughAmountThreshold: initialValues?.enoughAmountThreshold || 10,
      supplierIds: initialValues?.supplierIds || [],
    },
    validationSchema: MaterialSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        await onSubmit(values);
        toast.success(
          `Матеріал успішно ${initialValues ? "оновлено" : "добавлено"}!`
        );
      } catch (error) {
        toast.error(
          `Не вдалося ${initialValues ? "оновити" : "добавити"} матеріал!`
        );
        console.error(
          `Error ${initialValues ? "updating" : "creating"} material:`,
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
        {initialValues ? "Оновити матеріал" : "Новий матеріал"}
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Назва
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Шампунь Head&Schoulders"
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Категорія
            </label>
            <select
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            >
              <option value="">– – –</option>
              <option key="head_care" value="HAIR_CARE">
                Догляд за волоссям
              </option>
              <option key="nail_care" value="NAIL_CARE">
                Догляд за нігтями
              </option>
              <option key="skin_care" value="SKIN_CARE">
                Догляд за шкірою
              </option>
              <option key="tools" value="TOOLS">
                Інструменти
              </option>
              <option key="other" value="OTHER">
                Інше
              </option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.category}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="unit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Одиниці виміру
            </label>
            <select
              id="unit"
              name="unit"
              value={formik.values.unit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            >
              <option value="">– – –</option>
              <option key="ml" value="ML">
                Мл
              </option>
              <option key="gr" value="GR">
                Гр
              </option>
              <option key="ones" value="ONES">
                Шт
              </option>
            </select>
            {formik.touched.unit && formik.errors.unit && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.unit}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Об'єм
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="300"
              min="0"
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.quantity && formik.errors.quantity && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.quantity}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ціна (грн)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.setFieldValue(
                  "price",
                  parseFloat(parseFloat(e.target.value).toFixed(2)) || 0
                );
              }}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.price && formik.errors.price && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.price}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Кількість
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="0"
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.amount}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="supplierIds"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Постачальники
            </label>
            {selectedSupplierIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSupplierIds.map((id) => {
                  const supplier = suppliers.find((s) => Number(s.id) === id);

                  return (
                    <span
                      key={id}
                      className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {supplier?.name} | {supplier?.rating}⭐️
                      <button
                        type="button"
                        className="ml-2 text-blue-500 hover:text-red-600"
                        onClick={() =>
                          setSelectedSupplierIds((prev) =>
                            prev.filter((supplierId) => supplierId !== id)
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
              id="supplierIds"
              name="supplierIds"
              value=""
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                if (!selectedSupplierIds.includes(selectedId)) {
                  setSelectedSupplierIds([...selectedSupplierIds, selectedId]);
                }
              }}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            >
              <option value="">– – –</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} | {supplier.rating}⭐️
                </option>
              ))}
            </select>
            {formik.touched.supplierIds && formik.errors.supplierIds && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.supplierIds}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="minAmountThreshold"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Мінімальний поріг
            </label>
            <input
              type="number"
              id="minAmountThreshold"
              name="minAmountThreshold"
              min="0"
              value={formik.values.minAmountThreshold}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 italic mt-1">
              * При досягненні цієї кількості або нижче система повідомить про
              необхідність поповнення.
            </p>
            {formik.touched.minAmountThreshold &&
              formik.errors.minAmountThreshold && (
                <p className="text-xs text-red-500 font-medium">
                  {formik.errors.minAmountThreshold}
                </p>
              )}
          </div>

          <div>
            <label
              htmlFor="enoughAmountThreshold"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Достатній поріг
            </label>
            <input
              type="number"
              id="enoughAmountThreshold"
              name="enoughAmountThreshold"
              min="0"
              value={formik.values.enoughAmountThreshold}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 italic mt-1">
              * Якщо кількість більша або дорівнює цьому значенню — система
              вважає запас достатнім.
            </p>
            {formik.touched.enoughAmountThreshold &&
              formik.errors.enoughAmountThreshold && (
                <p className="text-xs text-red-500 font-medium">
                  {formik.errors.enoughAmountThreshold}
                </p>
              )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Опис
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.description}
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

export default MaterialForm;
