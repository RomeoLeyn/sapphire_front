import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MaterialUsage } from "../../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UsageChartProps {
  usageData: MaterialUsage[];
  title: string;
}

const UsageChart: React.FC<UsageChartProps> = ({ usageData, title }) => {
  // Group usage data by material
  const groupedData = usageData.reduce((acc, usage) => {
    if (!acc[usage.material.name]) {
      acc[usage.material.name] = 0;
    }
    acc[usage.material.name] += usage.material.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: "Використано (шт)",
        data: Object.values(groupedData),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-[400px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default UsageChart;
