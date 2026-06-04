"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // ✅ using centralized API
        const data = await fetchFromAPI("/blogs");
        setBlogs(data || []);
      } catch (err) {
        console.error("Blogs fetch error:", err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="blogs-section">
      <h2 className="blogs-title">BLOGS</h2>

      <div className="blogs-grid">
        {blogs.map((blog, i) => (
          <div key={i} className="blog-card">
            <div className="blog-img">
              <Image
                src={
                  blog.image
                    ? `${BASE_URL}/${blog.image}` 
                    : "/blogs1.webp"
                }
                alt={blog.title}
                fill
                className="img"
              />
            </div>

            <h3>{blog.title}</h3>
            <p>{blog.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}