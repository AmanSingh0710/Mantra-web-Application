"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
  FaEye,
} from "react-icons/fa";

export default function ProductCard({ product }) {
  const router = useRouter();

  const [wishlist, setWishlist] = useState(false);

  if (!product) return null;

  const image =
    product.thumbnail?.url ||
    product.images?.[0]?.url ||
    "/images/product-placeholder.png";

  const hoverImage =
    product.images?.length > 0
      ? product.images[0].url
      : image;

  const mrp = product.price || 0;

  const sellingPrice =
    product.discountPrice > 0
      ? product.discountPrice
      : mrp;

  let discount = 0;

  if (mrp > sellingPrice) {
    discount = Math.round(
      ((mrp - sellingPrice) / mrp) * 100
    );
  }

  const rating =
    Number(product.averageRating || 0).toFixed(1);

  return (
    <div
      onClick={() =>
        router.push(`/product/${product._id}`)
      }
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* ----------------------- Badge --------------------- */}

      {discount > 0 && (
        <div className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded">
          {discount}% OFF
        </div>
      )}

      {product.listingType === "BESTSELLER" && (
        <div className="absolute top-3 right-3 z-20 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold">
          Bestseller
        </div>
      )}

      {product.listingType === "NEW_ARRIVAL" && (
        <div className="absolute top-3 right-3 z-20 bg-green-600 text-white text-[10px] px-2 py-1 rounded-full font-semibold">
          New
        </div>
      )}

      {product.listingType === "COMBOS" && (
        <div className="absolute top-3 right-3 z-20 bg-purple-600 text-white text-[10px] px-2 py-1 rounded-full font-semibold">
          Combo
        </div>
      )}

      {/* Wishlist */}

      <button
        onClick={(e) => {
          e.stopPropagation();
          setWishlist(!wishlist);
        }}
        className="absolute bottom-3 right-3 z-20 bg-white rounded-full shadow-md p-2 hover:scale-110 transition"
      >
        {wishlist ? (
          <FaHeart className="text-red-500 text-sm" />
        ) : (
          <FaRegHeart className="text-gray-600 text-sm" />
        )}
      </button>

      {/* ----------------------- Image ---------------------- */}

      <div className="relative overflow-hidden aspect-square bg-gray-100">

        <img
          src={image}
          alt={product.productName}
          className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:opacity-0"
          loading="lazy"
        />

        <img
          src={hoverImage}
          alt={product.productName}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500"
          loading="lazy"
        />

        {product.stockStatus === "OUT_OF_STOCK" && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-black px-4 py-2 rounded font-bold">
              OUT OF STOCK
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition">
          <button className="bg-black text-white rounded-full p-3">
            <FaEye />
          </button>
        </div>
      </div>

      {/* ---------------------- Content ---------------------- */}

      <div className="p-4">

        {product.brand?.name && (
          <p className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold mb-1">
            {product.brand.name}
          </p>
        )}

        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[42px]">
          {product.productName}
        </h3>

        {/* Rating */}

        <div className="flex items-center gap-1 mt-2">

          <div className="flex text-yellow-400">

            {[1,2,3,4,5].map((item)=>(
              item<=Math.round(rating)
              ?
              <FaStar key={item} size={12}/>
              :
              <FaRegStar key={item} size={12}/>
            ))}

          </div>

          <span className="text-xs text-gray-600">

            {rating}

          </span>

          <span className="text-xs text-gray-400">

            ({product.totalReviews || 0})

          </span>

        </div>

        {/* Price */}

        <div className="mt-3 flex items-end gap-2 flex-wrap">

          <span className="text-xl font-bold text-black">

            ₹{sellingPrice}

          </span>

          {sellingPrice < mrp && (

            <span className="line-through text-gray-400 text-sm">

              ₹{mrp}

            </span>

          )}

        </div>

        {product.stock <= 10 &&
          product.stock > 0 && (

            <p className="text-red-500 text-xs mt-2 font-semibold">

              Only {product.stock} left

            </p>

          )}

        {product.shippingType === "FREE" && (

          <div className="inline-block mt-3 bg-green-100 text-green-700 text-[11px] px-2 py-1 rounded-full">

            Free Delivery

          </div>

        )}

      </div>

    </div>
  );
}