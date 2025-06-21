import { useFormik } from "formik";
import { AlertTriangle, Plus, Save, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getBriefMaterials } from "../../services/materialService";
import { getSuppliersByMaterialId } from "../../services/supplierService";
import { MaterialBrief, MaterialSupply, SupplierBrief } from "../../types";
import { getCategory } from "../../utils/utils";
import Modal from "../Common/Modal/Modal";

interface SupplyFormProps {
  initialValues?: Partial<MaterialSupply> | SupplierBrief[];
  materialId?: string;
  suppliersId?: SupplierBrief[];
  onSubmit: (
    values: Omit<
      MaterialSupply | SupplierBrief[],
      "id" | "createdAt" | "updatedAt"
    >
  ) => Promise<void>;
  onCancel: () => void;
}

const SupplySchema = Yup.object().shape({
  materialId: Yup.string().required("Це поле обов'язкове"),
  supplierId: Yup.string().required("Це поле обов'язкове"),
  amount: Yup.number()
    .required("Це поле обов'язкове")
    .positive("Це поле повинне бути більше нуля"),
  supplyDate: Yup.date().required("Це поле обов'язкове"),
  note: Yup.string(),
});

const SuppliesForm: React.FC<SupplyFormProps> = ({
  initialValues,
  materialId,
  onSubmit,
  onCancel,
}) => {
  const [materials, setMaterials] = useState<MaterialBrief[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierBrief[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materialsData = await getBriefMaterials();
        setMaterials(materialsData);
      } catch (error) {
        toast.error("Не вдалося отримати списки матеріалів та постачальників");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      materialId: materialId || "",
      supplierId: initialValues?.supplier?.id || "",
      amount: 1,
      supplyDate: new Date().toISOString().split("T")[0],
      note: "",
    },
    validationSchema: SupplySchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        const formattedValues = {
          ...values,
          supplyDate: new Date(values.supplyDate),
        };

        await onSubmit(formattedValues);
        toast.success(
          `Поставку матеріалу успішно ${
            initialValues ? "оновлено" : "замовлено"
          }!`
        );
        resetForm();
      } catch (error) {
        toast.error(
          `Не вдалося ${
            initialValues ? "оновити" : "замовити"
          } поставку матеріалу!`
        );
        console.error(
          `Error ${initialValues ? "updating" : "creating"} supply:`,
          error
        );
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      const materialId = formik.values.materialId;
      if (materialId) {
        try {
          const response = await getSuppliersByMaterialId(materialId);
          setSuppliers(response);
          formik.setFieldValue("supplierId", "");
        } catch (error) {
          toast.error("Не вдалося отримати список постачальників");
        }
      }
    };

    fetchSuppliers();
  }, [formik.values.materialId, materialId]);

  const handleConfirmOrder = () => {
    setIsModalOpen(false);
    formik.submitForm();
  };

  return (
    <div className="relative bg-gray-50 p-6 rounded-xl border-2 border-gray-200 max-w-full">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Підтвердити замовлення"
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
              onClick={handleConfirmOrder}
            >
              Підтвердити замовлення
            </button>
          </>
        }
      >
        <div className="flex flex-col items-center text-center space-y-4 my-2">
          <div className="flex items-center gap-3 text-blue-700">
            <AlertTriangle size={42} />
            <h3 className="text-lg font-bold text-gray-800">
              Ви дійсно хочете оформити замовлення?
            </h3>
          </div>

          <p className="text-md text-gray-700 font-semibold">
            Після підтвердження ви{" "}
            <span className="font-bold text-gray-900">не зможете змінити</span>{" "}
            інформацію про цю поставку.
            <br /> Перевірте дані уважно перед оформленням.
          </p>
        </div>
      </Modal>

      <button
        className="absolute border-2 border-gray-300 p-1 rounded-xl right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-300 transition duration-150"
        onClick={onCancel}
      >
        <Plus className="w-7 h-7 rotate-45 transition duration-150" />
      </button>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {initialValues
          ? "замовлення про поставку матеріалу"
          : "Новий замовлення про поставку матеріалу"}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="space-y-6"
      >
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
              htmlFor="supplierId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Постачальник
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={formik.values.supplierId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            >
              <option value="">– – –</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier?.name} | {supplier?.rating}⭐️
                </option>
              ))}
            </select>
            {formik.touched.supplierId && formik.errors.supplierId && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.supplierId}
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
              min="1"
              className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formik.errors.amount}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="supplyDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Очікувана дата поставки
            </label>
            <div>
              <input
                type="date"
                id="supplyDate"
                name="supplyDate"
                value={formik.values.supplyDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              />
              {formik.touched.supplyDate && formik.errors.supplyDate ? (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.supplyDate}
                </p>
              ) : null}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Нотатка
            </label>
            <div className="mt-1">
              <textarea
                id="note"
                name="note"
                rows={3}
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-md border-2 border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              />
              {formik.touched.note && formik.errors.note ? (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.note}
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
            onClick={() => setIsModalOpen(true)}
            disabled={formik.isSubmitting || loading}
            className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? "Збереження..." : initialValues ? "Оновити" : "Замовити"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuppliesForm;
