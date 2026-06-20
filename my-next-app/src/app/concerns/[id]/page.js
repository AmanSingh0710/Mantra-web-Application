"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";

export default function ConcernProductsPage() {

  const { id } = useParams();

  const [products, setProducts] = useState([]);

  useEffect(() => {

    const loadProducts = async () => {

      const data = await fetchFromAPI(
        `/Adminproducts/public/by-concern/${id}`
      );

      if (data.success) {
        setProducts(data.products);
      }

    };

    loadProducts();

  }, [id]);

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Concern Products
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {products.map((product) => (

          <div
            key={product._id}
            className="border rounded-lg p-3"
          >
            <img
              src={product.thumbnail}
              alt={product.productName}
              className="w-full h-52 object-cover"
            />

            <h2 className="font-semibold mt-2">
              {product.productName}
            </h2>

            <p className="text-green-600">
              ₹{product.price}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}