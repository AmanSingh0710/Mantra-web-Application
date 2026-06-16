"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";
//src/components/Blogs.js
export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetchFromAPI("/blogs");

        if (response?.success) {
          setBlogs(response.blogs || []);
        }
      } catch (error) {
        console.error("Blogs fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  // Amazon/Flipkart inspired skeleton loader
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-gray-50 min-h-screen">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-6 pb-2 border-b border-gray-200">
          OUR BLOGS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-md p-4 space-y-4 animate-pulse">
              <div className="bg-gray-200 aspect-video w-full rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-gray-50 min-h-screen">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Featured Stories & Updates
        </h2>
        <span className="text-sm text-gray-500 hidden sm:inline">
          Showing {blogs.length} articles
        </span>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-md">
          <p className="text-gray-500 text-lg">No blogs found at the moment.</p>
        </div>
      ) : (
        /* Highly Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop, 4 on large wide screens */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.slug}`}
              className="group flex flex-col bg-white border border-gray-200 rounded-md overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300"
            >
              {/* Image Container with fixed Aspect Ratio like Amazon listings */}
              <div className="relative w-full aspect-video bg-gray-100 overflow-hidden border-b border-gray-100">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text content container with flex-grow to keep heights uniform */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Title: Emulates Amazon title hover color mechanics */}
                <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors mb-2 leading-snug">
                  {blog.title}
                </h3>

                {/* Description snippet */}
                <p className="text-xs md:text-sm text-gray-600 line-clamp-3 leading-relaxed mt-auto">
                  {blog.description}
                </p>

                {/* Read More layout footer resembling retail item details */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-blue-600 group-hover:underline">
                  <span>Read full story</span>
                  <span className="text-gray-400 font-normal">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}