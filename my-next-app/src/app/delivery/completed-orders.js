export default function CompletedOrdersPage() {
  const orders = [
    { id: "#D1001", customer: "Aman", status: "Delivered", amount: "₹450" },
    { id: "#D1002", customer: "Rahul", status: "Delivered", amount: "₹890" },
    { id: "#D1003", customer: "Neha", status: "Returned", amount: "₹320" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Completed Orders</h1>
      <p className="text-gray-500 mt-1">All successfully delivered orders</p>

      <div className="mt-6 bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Order ID</th>
              <th className="text-left">Customer</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="p-3 font-medium">{o.id}</td>
                <td>{o.customer}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      o.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>

                <td>{o.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}