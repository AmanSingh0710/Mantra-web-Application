"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 24000 },
  { month: "Apr", revenue: 17000 },
  { month: "May", revenue: 29000 },
  { month: "Jun", revenue: 36000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">

      <h2 className="text-xl font-bold mb-6">
        Revenue Analytics
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <Tooltip />

          <Line
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}