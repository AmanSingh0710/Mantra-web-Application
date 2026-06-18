"use client";

import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Eye, Trash2, Search, MapPin, Store, User, Calendar, X, Printer } from "lucide-react";

const displayAddress = (order) =>
  order.address ||
  order.shippingAddress?.street ||
  order.shippingAddress?.city ||
  "N/A";

export default function AllOrders({ filter }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ================= FETCH ORDERS =================
  const fetchMyOrders = async () => {
    try {
      const data = await fetchFromAPI("/order/admin/all", {
        method: "GET",
      });

      setOrders(data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH DELIVERY MEN =================
  const fetchDeliveryMen = async () => {
    try {
      const data = await fetchFromAPI("/deliveryman/list", {
        method: "GET",
      });

      setDeliveryMen(
        Array.isArray(data) ? data : data?.deliveryMen || []
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeliveryMen();
    fetchMyOrders();
  }, []);

  // Filter logic
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;

    return orders.filter((order) => {

      const id = order._id?.toLowerCase() || "";

      const customerName = order.userId?.name?.toLowerCase() || "";

      const customerMobile = order.userId?.mobile || "";

      const query = searchQuery.toLowerCase();

      return id.includes(query) ||
        customerName.includes(query) ||
        customerMobile.includes(query);
    });
  }, [orders, searchQuery]);

  // ================= ASSIGN DELIVERY MAN =================
  const handleAssign = async (orderId, deliveryManId) => {
    try {
      const res = await fetchFromAPI(
        "/order/assign-delivery-boy",
        {
          method: "PUT",
          body: JSON.stringify({ orderId, deliveryManId }),
        }
      );

      toast.success("Delivery man assigned");
      fetchMyOrders();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ================= STATUS CHANGE =================
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetchFromAPI(`/order/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      toast.success("Status updated!");
      fetchMyOrders();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (orderId) => {
    if (!confirm("Are you sure?")) return;

    try {
      await fetchFromAPI(`/order/${orderId}`, {
        method: "DELETE",
      });

      toast.success("Order deleted");
      fetchMyOrders();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };


  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="p-1 bg-blue-100 rounded text-sm">📦</span> ORDER MANAGEMENT
          </h1>
          <p className="text-[10px] md:text-xs text-gray-500">Manage {orders.length} total orders</p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID or Customer..."
            className="text-black pl-9 pr-4 py-2 border rounded-xl text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[#1e293b] text-white uppercase text-[11px] tracking-wider font-bold">
                <th className="px-4 py-4 text-center">SL</th>
                <th className="px-4 py-4">Order ID</th>
                <th className="px-4 py-4">Order Date</th>
                <th className="px-4 py-4">Customer Info</th>
                <th className="px-4 py-4">Store</th>
                <th className="px-4 py-4">Items</th>
                <th className="px-4 py-4">Payment & Amount</th>
                <th className="px-4 py-4">Delivery Status</th>
                <th className="px-4 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
                  {/* SL */}
                  <td className="px-4 py-4 text-center text-xs font-bold text-gray-900">
                    {index + 1}
                  </td>

                  {/* ORDER INFO & ASSIGN DELIVERY MAN */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      {/* Order ID Display */}
                      <div className="text-blue-600 font-bold text-xs uppercase tracking-tight">
                        #{order._id.slice(-7)}
                      </div>

                      {/* Delivery Man Assignment Dropdown */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Assign DeliveryMan</label>
                        <select
                          className={`text-[10px] font-semibold p-1.5 border rounded-md outline-none transition-all ${order.deliveryManId
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-orange-50 border-orange-200 text-orange-700"
                            }`}
                          value={order.deliveryManId || ""}
                          onChange={(e) => handleAssign(order._id, e.target.value)}
                        >
                          <option value="">Select Delivery Man</option>
                          {deliveryMen.map((man) => (
                            <option key={man._id} value={man._id}>
                              {man.firstName} {man.lastName} ({man.phoneNumber || 'No Mobile'})
                            </option>
                          ))}
                        </select>

                        {/* Small indicator if already assigned */}
                        {order.deliveryManId && (
                          <span className="text-[9px] text-green-600 font-medium italic">
                            Currently Assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ORDER DATE */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
                      <Calendar size={12} className="text-gray-400" />
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </div>
                  </td>

                  {/* CUSTOMER INFO */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        <User size={12} className="text-blue-500" /> {order.userId?.name || "Guest User"}
                      </span>
                      <span className="text-[10px] text-gray-500 mt-0.5">{order.userId?.mobile || "No Mobile"}</span>
                    </div>
                  </td>

                  {/* STORE */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-700 font-semibold">
                      <Store size={14} className="text-purple-500" />
                      {order.storeId?.shopName || order.storeName || "Main Branch"}
                    </div>
                  </td>

                  {/* ITEMS */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded border bg-gray-50 overflow-hidden">
                        <img
                          src={order.products?.[0]?.image || "/placeholder.png"}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <span className="text-[11px] font-bold text-gray-600">
                        x{order.products?.length || 0}
                      </span>
                    </div>
                  </td>

                  {/* PAYMENT & AMOUNT */}
                  <td className="px-4 py-4">
                    <div className="text-xs font-black text-gray-900">₹{order.totalAmount}</div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                      {order.paymentStatus || 'UNPAID'}
                    </span>
                  </td>

                  {/* DELIVERY STATUS */}
                  <td className="px-4 py-4">
                    <select
                      className="text-[10px] font-bold py-1 px-2 rounded-lg border bg-blue-50 text-blue-700 cursor-pointer outline-none focus:ring-2 focus:ring-blue-200"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-3 text-gray-400">
                      <button onClick={() => handleView(order)} className="hover:text-blue-600 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleDelete(order._id)} className="hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">

            {/* HEADER */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Order ID #{selectedOrder._id.slice(-7)}</h2>
                <p className="text-xs text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
                >
                  <Printer size={16} /> Print Invoice
                </button>
                <button onClick={closeModal} className="text-gray-400 hover:text-red-500 p-1">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* STATUS & PAYMENT BAR */}
              <div className="flex flex-wrap gap-4 mb-6 justify-end text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-500 font-medium">Status:</span>
                  <span className="bg-green-100 text-green-600 px-3 py-0.5 rounded-full font-bold">{selectedOrder.status}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 font-medium">Payment Method:</span>
                  <span className="text-gray-800 font-bold">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 font-medium">Payment Status:</span>
                  <span className="text-green-500 font-bold">{selectedOrder.paymentStatus}</span>
                </div>
              </div>

              {/* ITEMS TABLE */}
              <div className="overflow-x-auto border rounded-lg mb-8">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="px-4 py-3">SL</th>
                      <th className="px-4 py-3">Item Details</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedOrder.products.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-900">{index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image} className="w-12 h-12 rounded-lg object-cover border" alt="" />
                            <div>
                              <p className="font-bold text-gray-800">{item.name}</p>
                              <p className="text-[10px] text-gray-400">Unit Price:₹ {item.price}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right text-gray-900">₹{item.price}</td>
                        <td className="px-4 py-4 text-right text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-4 text-right font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* BOTTOM SECTION: TOTALS & CUSTOMER INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* CUSTOMER INFORMATION (Requested at bottom) */}
                <div className="bg-gray-50 p-5 rounded-xl border border-dashed border-gray-300">
                  <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <User size={16} className="text-blue-500" /> Customer Information
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {selectedOrder.userId?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-base">{selectedOrder.userId?.name || "Guest User"}</p>
                      <p className="text-xs text-gray-500">{selectedOrder.userId?.mobile}</p>
                      <p className="text-xs text-gray-500">{selectedOrder.userId?.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border">
                    <p className="font-bold mb-1">Shipping Address:</p>
                    <p>{selectedOrder.shipping?.address}, {selectedOrder.shipping?.city}</p>
                    <p>{selectedOrder.shipping?.state}, {selectedOrder.shipping?.pin}</p>
                  </div>
                </div>

                {/* BILLING SUMMARY */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-900">
                    <span>Item price</span>
                    <span>₹ {(selectedOrder.totalAmount - selectedOrder.deliveryCharge).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-900 border-b pb-2">
                    <span>Delivery Charge</span>
                    <span>₹{(selectedOrder.deliveryCharge || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-gray-900 pt-2">
                    <span>Total</span>
                    <span className="text-blue-600">₹{(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );



}
// @media print {
//   body * {
//     visibility: hidden;
//   }
//     /* Only show the modal content during print */
//     .fixed.inset - 0.z - 50 * {
//       visibility: visible;
//     }
//       .fixed.inset - 0.z - 50 {
//     position: absolute;
//     left: 0;
//     top: 0;
//   }
//   /* Hide the close and print buttons during printing */
//   button {
//     display: none!important;
//   }
// }

