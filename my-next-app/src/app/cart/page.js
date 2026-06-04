"use client";

import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

function CartContent() {
  const searchParams = useSearchParams();
  const [cart, setCart] = useState([]);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState("all"); // "all" or "single"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shipping, setShipping] = useState({
    name: "", email: "", mobile: "", address: "", city: "", state: "", country: "", pin: "",
  });
  const [shippingErrors, setShippingErrors] = useState({});

  const getDiscountedPrice = (price, discount, type) => {
    if (!discount || discount <= 0) return price;
    if (type === "Percent") return price - (price * discount) / 100;
    return price - discount;
  };

  const fetchCart = async () => {
    try {
      const data = await fetchFromAPI("/cart");
      const items = data.items || [];
      setCart(items);

      // 🌟 Amazon/Flipkart Trigger: If coming from "Buy Now", immediately pop open the checkout form
      const immediateCheckout = searchParams.get("checkout");
      if (immediateCheckout === "true" && items.length > 0) {
        // Automatically default checkout to the latest item added or the whole cart
        setCheckoutMode("all");
        setShowShippingForm(true);
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch cart");
    }
  };

  useEffect(() => { 
    fetchCart(); 
  }, [searchParams]);

  const updateQty = async (productId, delta) => {
    try {
      await fetchFromAPI("/cart/add", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: delta }),
      });
      fetchCart();
    } catch (err) {
      toast.error(err.message || "Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await fetchFromAPI("/cart/remove", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
      fetchCart();
      toast.success("Item removed");
    } catch (err) {
      toast.error(err.message || "Failed to remove item");
    }
  };

  // Open modal for a single product purchase link click
  const openSingleShippingForm = (product) => { 
    setSelectedProduct(product); 
    setCheckoutMode("single");
    setShowShippingForm(true); 
  };

  // Open modal for entire cart purchase
  const openAllShippingForm = () => {
    if (cart.length === 0) return toast.error("Your cart is empty");
    setCheckoutMode("all");
    setShowShippingForm(true);
  };

  const closeShippingForm = () => { 
    setShowShippingForm(false); 
    setSelectedProduct(null);
    setShippingErrors({}); 
  };

  const validateShipping = () => {
    const errors = {};
    if (!shipping.name.trim()) errors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(shipping.email)) errors.email = "Invalid email address";
    if (!/^[0-9]{10}$/.test(shipping.mobile)) errors.mobile = "10-digit mobile number required";
    if (!shipping.address.trim()) errors.address = "Complete address is required";
    if (!/^[0-9]{6}$/.test(shipping.pin)) errors.pin = "6-digit ZIP/Pin code required";
    return errors;
  };

  const handlePlaceOrder = async () => {
    const errors = validateShipping();
    setShippingErrors(errors);

    if (Object.keys(errors).length > 0) {
      return toast.error("Please fill all required delivery details");
    }

    try {
      let orderPayload = {};

      if (checkoutMode === "single" && selectedProduct) {
        const finalPrice = getDiscountedPrice(
          selectedProduct.price,
          selectedProduct.discountAmount,
          selectedProduct.discountType
        );
        orderPayload = {
          shipping,
          products: [{
            productId: selectedProduct.productId,
            name: selectedProduct.name,
            quantity: selectedProduct.quantity,
            price: finalPrice
          }],
          totalAmount: finalPrice * (selectedProduct.quantity || 1),
          paymentMethod: "COD",
        };
      } else {
        // Bulk order placement for the entire cart layout
        const structuredProducts = cart.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: getDiscountedPrice(item.price, item.discountAmount, item.discountType)
        }));

        const totalCartPrice = cart.reduce((sum, item) => {
          return sum + (getDiscountedPrice(item.price, item.discountAmount, item.discountType) * item.quantity);
        }, 0);

        orderPayload = {
          shipping,
          products: structuredProducts,
          totalAmount: totalCartPrice,
          paymentMethod: "COD",
        };
      }

      await fetchFromAPI("/order", {
        method: "POST",
        body: JSON.stringify(orderPayload),
      });

      toast.success("🎉 Order placed successfully via COD!");
      closeShippingForm();
      
      // Clear local state cart or trigger route dispatch cleanup
      setCart([]);
      fetchCart();

    } catch (err) {
      toast.error(err.message || "Order checkout sequence failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Shopping Bag</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: PRODUCT LISTINGS */}
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl shadow-sm text-gray-400 font-medium">
              Your shopping cart is empty. Explore items to get started!
            </div>
          ) : (
            cart.map((item) => {
              const priceAfterDiscount = getDiscountedPrice(item.price, item.discountAmount, item.discountType);

              return (
                <div key={item.productId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-contain rounded-lg border bg-gray-50" />

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{item.category} {item.brand && `| ${item.brand}`}</p>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">₹{priceAfterDiscount}</span>
                      {item.discountAmount > 0 && (
                        <span className="text-sm line-through text-gray-400">₹{item.price}</span>
                      )}
                    </div>

                    {item.currentStock < 5 && item.currentStock > 0 && (
                      <p className="text-orange-600 text-xs font-semibold mt-1">⚠️ Hurry, only {item.currentStock} left in warehouse stock!</p>
                    )}
                  </div>

                  {/* Quantity Counter controls */}
                  <div className="flex flex-col items-end gap-3 text-black">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 shadow-sm overflow-hidden">
                      <button onClick={() => updateQty(item.productId, -1)} className="px-3 py-1 hover:bg-gray-200 text-gray-600 font-bold transition">-</button>
                      <span className="px-3 font-semibold text-sm bg-white min-w-[30px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, 1)} className="px-3 py-1 hover:bg-gray-200 text-gray-600 font-bold transition">+</button>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => removeItem(item.productId)} className="text-gray-400 hover:text-red-600 text-xs font-medium transition">Remove</button>
                      <button onClick={() => openSingleShippingForm(item)} className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-1 rounded-md text-xs font-bold shadow-sm transition">Buy This</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: CALCULATION WRAPPER */}
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Price Details</h2>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Price ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>₹{cart.reduce((s, i) => s + (i.price * i.quantity), 0)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount Savings</span>
              <span>- ₹{cart.reduce((s, i) => s + (i.price - getDiscountedPrice(i.price, i.discountAmount, i.discountType)) * i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            
            <hr className="border-dashed" />
            
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-1">
              <span>Total Amount</span>
              <span>₹{cart.reduce((s, i) => s + (getDiscountedPrice(i.price, i.discountAmount, i.discountType) * i.quantity), 0)}</span>
            </div>
          </div>

          <button 
            onClick={openAllShippingForm}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-4 py-3 rounded-xl font-bold tracking-wide shadow-md transition duration-200"
          >
            PLACE ORDER FOR ALL
          </button>
        </div>
      </div>

      {/* DELIVERY FORM MODAL LAYER */}
      {showShippingForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white text-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Add Delivery Address</h2>
              <span className="text-xs bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded uppercase">COD Mode</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(shipping).map((key) => (
                <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {key === 'pin' ? 'Pin Code' : key === 'mobile' ? 'Mobile Number' : key}
                  </label>
                  <input
                    type={key === 'email' ? 'email' : 'text'}
                    className="w-full border-b-2 border-gray-100 focus:border-orange-500 outline-none py-1.5 transition text-sm font-medium text-gray-800"
                    placeholder={`Enter ${key}...`}
                    value={shipping[key]}
                    onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })}
                  />
                  {shippingErrors[key] && <p className="text-red-500 text-[10px] mt-0.5 font-semibold">⚠️ {shippingErrors[key]}</p>}
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8 border-t pt-4">
              <button onClick={closeShippingForm} className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-sm transition">Cancel</button>
              <button onClick={handlePlaceOrder} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-md transition">Confirm Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Next.js requirement: Wrap search-dependent components in a Suspense boundary
export default function CartPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Cart Profile...</div>}>
      <CartContent />
    </Suspense>
  );
}