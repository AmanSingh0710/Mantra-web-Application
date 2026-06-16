"use client";
import BlogDetails from "@/components/BlogDetails";

export default function BlogDetailsPage({ params }) {
  return <BlogDetails slug={params.slug} />;
}