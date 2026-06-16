"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";

export default function BlogDetails({ slug }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlog = async () => {
      try {
        const data = await fetchFromAPI(`/blogs/slug/${slug}`);

        if (data.success) {
          setBlog(data.blog);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        Blog not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-[400px] object-cover rounded-lg mb-6"
      />

      <h1 className="text-4xl font-bold mb-4">
        {blog.title}
      </h1>

      <div className="text-sm text-gray-500 mb-6">
        By {blog.author}
      </div>

      <p className="text-lg text-gray-700 mb-6">
        {blog.description}
      </p>

      <div className="prose max-w-none">
        {blog.content}
      </div>
    </div>
  );
}