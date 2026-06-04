"use client";

import { fetchFromAPI } from "@/utils/api";
import { getUser } from "@/utils/auth";
import toast from "react-hot-toast";

export default function AddToCart({ productId }) {

  const addToCart = async () => {
    const user = getUser();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (user?.role !== "USER") {
      toast.error("Only users can add to cart");
      return;
    }

    try {
      await fetchFromAPI("/cart/add", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      toast.success("Added to cart 🛒");

    } catch (error) {
      toast.error(error.message || "Add to cart failed");
    }
  };

  return (
    <button
      onClick={addToCart}
      className="bg-black text-white px-4 py-2 rounded-lg"
    >
      Add to Cart
    </button>
  );
}