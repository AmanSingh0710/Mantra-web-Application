"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";

export default function MyOrders() {
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pin: "",
  });
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch cart
  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await fetchFromAPI("/cart");
      setProducts(data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // ✅ Calculate total
  useEffect(() => {
    const total = products.reduce(
      (sum, p) => sum + (p.price || p.productId?.price || 0) * p.quantity,
      0
    );
    setTotalAmount(total);
  }, [products]);

  // ✅ Update quantity
  const updateQty = async (productId, delta) => {
    if (delta === 0) return;

    const item = products.find((p) => p.productId?._id === productId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    try {
      await fetchFromAPI("/cart/add", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: delta }),
      });
      fetchCart();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // ✅ Remove item
  const removeItem = async (productId) => {
    try {
      await fetchFromAPI("/cart/remove", {
        method: "PUT",
        body: JSON.stringify({ productId }),
      });
      fetchCart();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  // ✅ Clear cart
  const clearCart = async () => {
    try {
      await fetchFromAPI("/cart/clear", {
        method: "DELETE",
      });
      setProducts([]);
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  // ✅ Shipping change
  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  // ✅ Validate
  const validate = () => {
    const tempErrors = {};
    if (!shipping.name.trim()) tempErrors.name = "Name required";
    if (!shipping.email || !/^\S+@\S+\.\S+$/.test(shipping.email)) tempErrors.email = "Valid email required";
    if (!shipping.mobile || !/^[0-9]{10}$/.test(shipping.mobile)) tempErrors.mobile = "10-digit mobile required";
    if (!shipping.address.trim()) tempErrors.address = "Address required";
    if (!shipping.city.trim()) tempErrors.city = "City required";
    if (!shipping.state.trim()) tempErrors.state = "State required";
    if (!shipping.country.trim()) tempErrors.country = "Country required";
    if (!shipping.pin || !/^[0-9]{6}$/.test(shipping.pin)) tempErrors.pin = "6-digit PIN required";
    if (!products.length) tempErrors.products = "Cart cannot be empty";

    if (Object.keys(tempErrors).length > 0) {
      toast.error("Fix errors before placing order");
      return false;
    }
    return true;
  };

  // ✅ Place order
  const handleOrder = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await fetchFromAPI("/order", {
        method: "POST",
        body: JSON.stringify({
          shipping,
          products: products.map((p) => ({
            productId: p.productId?._id || p._id,
            name: p.productId?.name || p.name,
            image: p.productId?.image || p.image,
            price: p.price || p.productId?.price,
            quantity: p.quantity,
            storeId: p.productId?.storeId || p.storeId,
          })),
          totalAmount,
          paymentMethod,
        }),
      });

      toast.success("Order placed successfully!");

      setShipping({
        name: "", email: "", mobile: "", address: "",
        city: "", state: "", country: "", pin: "",
      });

      setProducts([]);
      clearCart();

    } catch (err) {
      console.error(err);
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-5">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {products.map((item) => (
          <div key={item.productId?._id || item._id} className="bg-white rounded-xl shadow-lg p-5 flex flex-col justify-between">
            {/* Product info */}
            <div className="flex flex-col items-center gap-2">
              <img src={item.productId?.image || item.image} className="w-32 h-32 object-cover rounded-lg shadow-sm" />
              <p className="font-semibold text-lg text-center">{item.productId?.name || item.name}</p>
              <p className="text-blue-600 font-bold">₹{item.price || item.productId?.price}</p>
              <p className="text-gray-700 font-medium">Subtotal: ₹{(item.price || item.productId?.price) * item.quantity}</p>
            </div>

            {/* Quantity + Remove */}
            <div className="flex flex-col items-center gap-2 mt-3">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button onClick={() => updateQty(item.productId._id, -1)} className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200 font-bold">-</button>
                <span className="px-4 py-1">{item.quantity}</span>
                <button onClick={() => updateQty(item.productId._id, 1)} className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200 font-bold">+</button>
              </div>
              <button onClick={() => removeItem(item.productId._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded mt-2 font-semibold">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping Form */}
      <h2 className="text-2xl font-semibold mb-3">Shipping Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { label: "Full Name", name: "name" },
          { label: "Email", name: "email" },
          { label: "Mobile", name: "mobile" },
          { label: "Address", name: "address" },
          { label: "City", name: "city" },
          { label: "State", name: "state" },
          { label: "Country", name: "country" },
          { label: "PIN Code", name: "pin" },
        ].map((field) => (
          <div key={field.name}>
            <input
              type="text"
              name={field.name}
              placeholder={field.label}
              value={shipping[field.name]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Payment:</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="border p-2 rounded">
          <option value="COD">Cash on Delivery</option>
        </select>
      </div>

      {/* Total & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-bold text-xl">Total: ₹{totalAmount}</div>
        <div className="flex gap-2">
          <button onClick={clearCart} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Clear Cart</button>
          <button onClick={handleOrder} disabled={loading} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50">
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
