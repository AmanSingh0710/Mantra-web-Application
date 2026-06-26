"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

//src/app/concerns/[id]/page.js

import ProductGrid from "@/components/Product/ProductGrid";

export default function ConcernPage() {
  const { id } = useParams();

  const [concern, setConcern] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetchConcern();
  }, [id]);

  const fetchConcern = async () => {
    try {
      setLoading(true);

      const [concernRes, productRes] = await Promise.all([
        fetchFromAPI(`/concerns/public/${id}`),
        fetchFromAPI(`/Adminproducts/public/by-concern/${id}`)
      ]);

      if (concernRes.success) {
        setConcern(concernRes.concern);
      }

      if (productRes.success) {
        setProducts(productRes.products || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load concern");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
        <ProductGrid
          products={[]}
          loading={true}
        />
      </div>
    );
  }

  if (!concern) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold">
          Concern not found
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">

      {/* Banner */}
      <div className="rounded-xl overflow-hidden mb-10">
        <img
          src={concern.image}
          alt={concern.title}
          className="w-full h-[250px] md:h-[350px] object-cover"
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-black mb-2">
        {concern.title}
      </h1>

      <p className="text-gray-500 mb-8">
        {products.length} Products Found
      </p>

      <ProductGrid
        products={products}
        loading={false}
      />
    </div>
  );
}
