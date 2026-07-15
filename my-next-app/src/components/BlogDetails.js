"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";

export default function BlogDetails({ slug }) {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedBlogs, setRelatedBlogs] = useState([]);

    useEffect(() => {
        const getBlog = async () => {
            try {
                const blogRes = await fetchFromAPI(`/blogs/slug/${slug}`);

                if (blogRes.success) {
                    setBlog(blogRes.blog);
                }

                const blogsRes = await fetchFromAPI("/blogs");

                if (blogsRes.success) {
                    setRelatedBlogs(
                        blogsRes.blogs
                            .filter((b) => b.slug !== slug)
                            .slice(0, 3)
                    );
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getBlog();
    }, [slug]);

    // Loading Skeleton (Amazon/Flipkart Style)
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
                <div className="h-4 w-40 bg-gray-200 rounded mb-6"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-96 bg-gray-200 rounded-lg w-full"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4 mt-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="space-y-2 pt-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                    <div className="hidden lg:block h-64 bg-gray-100 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="max-w-7xl mx-auto py-20 px-4 text-center">
                <h2 className="text-2xl font-semibold text-gray-900">Blog post not found</h2>
                <p className="text-gray-500 mt-2">The article you are looking for might have been removed.</p>
                <button className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-md shadow-sm">
                    Go Back Home
                </button>
            </div>
        );
    }
    const wordCount = blog?.content?.split(" ").length || 0;

    const readingTime = Math.ceil(wordCount / 200);

    return (
        <div className="bg-gray-50 min-h-screen antialiased text-gray-900">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs - Highly typical of Amazon/Flipkart */}
                <nav className="flex mb-6 text-sm text-gray-500 overflow-x-auto whitespace-nowrap py-1">
                    <span className="hover:text-blue-600 cursor-pointer">Home</span>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="hover:text-blue-600 cursor-pointer">Blogs</span>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-700 font-medium truncate">{blog.title}</span>
                </nav>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left Column: Main Article Body */}
                    <article className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden p-4 sm:p-6 lg:p-8">

                        {/* Category / Tag */}
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded mb-4">
                            Featured Article
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
                            {blog.title}
                        </h1>

                        {/* Author and Metadata Bar */}
                        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-6 mb-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold text-xs">
                                    {blog.author?.charAt(0).toUpperCase() || "A"}
                                </div>
                                <span className="font-medium text-gray-900">By {blog.author}</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <div>
                                {new Date(blog.updatedAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1 text-amber-600 font-medium">
                                👁 {blog.views || 0} Views
                                <span className="text-gray-400 text-xs font-normal"></span>
                            </div>
                            <div>
                                📖 {readingTime} min read
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-100 mb-6 group">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
                            />
                        </div>

                        {/* Sub-description Box */}
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed border-l-4 border-amber-500 pl-4 my-6 italic bg-gray-50 py-3 pr-3 rounded-r">
                            {blog.description}
                        </p>

                        {/* Rich Text Body Content */}
                        <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed space-y-4 text-sm sm:text-base">
                            {blog.content}
                        </div>
                    </article>

                    {/* Right Column: Sticky E-commerce Style Sidebar */}
                    <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">

                        {/* "Buy Widget" / Actions Box */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Enjoyed this reading?</h3>
                            <p className="text-xs text-gray-500 mb-4">Subscribe to our weekly premium digest for unlimited professional insights.</p>

                            <div className="space-y-3">
                                <button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium text-sm py-2.5 px-4 rounded-md shadow-xs transition-colors duration-150">
                                    Join Newsletter
                                </button>
                                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm py-2.5 px-4 rounded-md shadow-xs transition-colors duration-150">
                                    Bookmark for Later
                                </button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                                <span>Secure reading connection</span>
                                <span className="text-blue-600 hover:underline cursor-pointer">Share Post</span>
                            </div>
                        </div>

                        {/* Recommended Content Box */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                            <h3 className="text-base font-bold text-gray-900 mb-4">Trending on our platform</h3>
                            <div className="space-y-4">
                                {relatedBlogs.map((item) => (
                                    <a
                                        key={item._id}
                                        href={`/blog/${item.slug}`}
                                        className="flex gap-3 group"
                                    >
                                        <div className="w-16 h-16 rounded border overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-semibold line-clamp-2 group-hover:text-blue-600">
                                                {item.title}
                                            </h4>

                                            <span className="text-[11px] text-gray-500">
                                                👁 {item.views || 0} Views
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                    </aside>

                </div>
            </div>
        </div>
    );
}