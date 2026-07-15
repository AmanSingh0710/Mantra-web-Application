"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { fetchWishlist(); }, []);
    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await fetchFromAPI("/user/wishlist");
            if (!response.success) throw new Error(response.message);
            setWishlist(response.wishlist);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const removeWishlist = async (productId) => {
        try {
            const response = await fetchFromAPI(`user/wishlist/${productId}`, { method: "DELETE" });
            if (!response.success) throw new Error(response.message);
            toast.success("Removed from wishlist");
            setWishlist(prev => prev.filter(item => item._id !== productId));
        } catch (error) {
            toast.error(error.message);
        }
    };
    const addToCart = async (productId) => {
        try {
            const response = await fetchFromAPI("/cart", { method: "POST", body: JSON.stringify({ productId, quantity: 1 }) });
            if (!response.success) throw new Error(response.message);
            toast.success("Added to cart");
        } catch (error) {
            toast.error(error.message);
        }
    };
    if (loading) return <div className="p-10">Loading...</div>;
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Wishlist</h1>
                    <p className="text-gray-500 mt-2">{wishlist.length} item(s)</p>
                </div>
            </div>
            {wishlist.length === 0 ? (
                <div className="bg-white rounded-xl border p-16 text-center">
                    <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
                    <p className="text-gray-500 mt-3">Save products you like here.</p>
                    <Link href="/products" className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-lg">Continue Shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {wishlist.map(product => (
                        <div key={product._id} className="border rounded-xl overflow-hidden bg-white">
                            <img src={product.thumbnail?.url} alt={product.productName} className="w-full h-56 object-cover" />
                            <div className="p-5 space-y-3">
                                <Link href={`/products/${product.slug}`} className="font-semibold text-lg">{product.productName}</Link>
                                <p className="text-xl font-bold">₹{product.discountPrice || product.price}</p>
                                <p className={product.stock > 0 ? "text-green-600" : "text-red-600"}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
                                <div className="flex gap-3">
                                    <button onClick={() => addToCart(product._id)} className="flex-1 bg-black text-white py-2 rounded-lg">Add to Cart</button>
                                    <button onClick={() => removeWishlist(product._id)} className="border px-4 rounded-lg">Remove</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}