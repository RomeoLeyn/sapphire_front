import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CalendarDays, CalendarRange } from "lucide-react";

interface DateRangePickerProps {
  onSubmit: (startDate: string, endDate: string) => void;
}

const DateRangeSchema = Yup.object().shape({
  startDate: Yup.date().required("Це поле обов'язкове"),
  endDate: Yup.date()
    .required("Це поле обов'язкове")
    .min(Yup.ref("startDate"), "Кінцева дата має бути після початкової")
    .max(new Date(), "Кінцева дата не може бути в майбутньому"),
});

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      startDate: new Date(new Date().setDate(new Date().getDate() - 30))
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    validationSchema: DateRangeSchema,
    onSubmit: (values) => {
      onSubmit(values.startDate, values.endDate);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-wrap items-end space-x-4"
    >
      <div className="flex flex-col gap-3">
        <div className="inline-flex gap-3">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-semibold text-gray-700"
            >
              Початкова дата
            </label>
            <div className="mt-1 inline-flex items-center gap-2">
              <CalendarDays size={36} />
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 p-2 text-md text-semibold border-gray-300 rounded-md"
                max={new Date().toISOString().split("T")[0]}
              />
              {formik.touched.startDate && formik.errors.startDate ? (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.startDate}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-semibold text-gray-700"
            >
              Кінцева дата
            </label>
            <div className="mt-1 inline-flex items-center gap-2">
              <CalendarRange size={36} />
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-2 p-2 text-md text-semibold border-gray-300 rounded-md"
                max={new Date().toISOString().split("T")[0]}
              />
              {formik.touched.endDate && formik.errors.endDate ? (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.endDate}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition-all"
          >
            Згенерувати звіт
          </button>
        </div>
      </div>
    </form>
  );
};

export default DateRangePicker;
