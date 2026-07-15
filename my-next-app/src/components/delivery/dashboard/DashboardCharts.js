"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function DashboardCharts({ analytics }) {
  const deliveryData = {
    labels: analytics.map(item => item.day),
    datasets: [
      {
        label: "Deliveries",
        data: analytics.map(item => item.deliveries),
        borderWidth: 3,
        tension: .4,
        fill: false,
        borderColor: "rgb(37, 99, 235)", // Standard blue color token for consistency
        backgroundColor: "rgba(37, 99, 235, 0.1)",
      }
    ]
  };

  const earningData = {
    labels: analytics.map(item => item.day),
    datasets: [
      {
        label: "Earnings",
        data: analytics.map(item => item.earnings),
        borderWidth: 3,
        tension: .4,
        fill: false,
        borderColor: "rgb(22, 163, 74)", // Standard green color token for earnings
        backgroundColor: "rgba(22, 163, 74, 0.1)",
      }
    ]
  };

  // Shared responsive configurations for Chart.js
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the container div to dictate the height on mobile
    plugins: {
      legend: {
        labels: {
          boxWidth: 12,
          font: { size: 12 }
        }
      }
    },
    scales: {
      x: { ticks: { maxRotation: 45, minRotation: 0 } } // Skews text cleanly if days crowd up on mobile
    }
  };

  return (
    /* Stacks 1 column on mobile/tablet, splits to 2 columns on desktops */
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
      
      {/* Deliveries Card Wrapper */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 flex flex-col w-full overflow-hidden">
        <h2 className="font-semibold text-base sm:text-lg mb-4 text-slate-800">
          Weekly Deliveries
        </h2>
        {/* Aspect-controlled wrapper ensuring the chart scales perfectly without breaking layout */}
        <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px]">
          <Line data={deliveryData} options={chartOptions} />
        </div>
      </div>

      {/* Earnings Card Wrapper */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 flex flex-col w-full overflow-hidden">
        <h2 className="font-semibold text-base sm:text-lg mb-4 text-slate-800">
          Weekly Earnings
        </h2>
        {/* Aspect-controlled wrapper ensuring the chart scales perfectly without breaking layout */}
        <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px]">
          <Line data={earningData} options={chartOptions} />
        </div>
      </div>

    </div>
  );
}