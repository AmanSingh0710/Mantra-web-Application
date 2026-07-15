// components/delivery/earnings/EarningsChart.jsx
"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function EarningsChart({ data = [] }) {
  const chartData = {
    labels: data.map(i => i.label),
    datasets: [{
      label: "Earnings",
      data: data.map(i => i.value),
      tension: .4
    }]
  };

  return (
    <div className="bg-white border rounded-xl p-6 text-gray-900">
      <h2 className="text-xl font-semibold mb-4">Earnings Chart</h2>
      <Line data={chartData} />
    </div>
  );
}
