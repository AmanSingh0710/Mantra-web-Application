"use client";

export default function RefundStats({ stats = {} }) {
  const cards = [
    {
      title: "Total Requests",
      value: stats.total || 0,
    },
    {
      title: "Pending",
      value: stats.pending || 0,
    },
    {
      title: "Approved",
      value: stats.approved || 0,
    },
    {
      title: "Refunded",
      value: stats.refunded || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-4"
        >
          <h3 className="text-gray-500 text-sm">
            {card.title}
          </h3>

          <p className="text-2xl font-bold mt-2">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}