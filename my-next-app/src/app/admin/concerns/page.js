"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/utils/api";
//src/app/admin/concerns/page.js
export default function ConcernsPage() {
    const [concerns, setConcerns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState(0);
    const [image, setImage] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);



    // ================= FETCH CONCERNS =================

    const fetchConcerns = async () => {
        try {
            const data = await fetchFromAPI("/concerns/admin/all", {
                credentials: "include",
            });

            if (data.success) {
                setConcerns(data.concerns);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ================= FETCH CATEGORIES =================

    const fetchCategories = async () => {
        try {
            const data = await fetchFromAPI("/categories/public", {
                credentials: "include",
            });


            if (data.success) {
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchConcerns();
        fetchCategories();
    }, []);

    // ================= CREATE CONCERN =================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("priority", priority);

            if (image) {
                formData.append("image", image);
            }

            selectedCategories.forEach((id) => {
                formData.append("categories", id);
            });

            let data;

            if (editingId) {
                data = await fetchFromAPI(`/concerns/update/${editingId}`, {
                    method: "PUT",
                    body: formData,
                });

                toast.success("Concern Updated");
            } else {
                data = await fetchFromAPI("/concerns/create", {
                    method: "POST",
                    body: formData,
                });

                toast.success("Concern Created");
            }

            if (data.success) {
                setEditingId(null);
                setTitle("");
                setPriority(0);
                setImage(null);
                setSelectedCategories(
                    item.categories?.map(cat =>
                        typeof cat === "object" ? cat._id : cat
                    ) || []
                );
                setSelectedCategories([]);


                fetchConcerns();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    // ================= DELETE =================

    const deleteConcern = async (id) => {
        if (!window.confirm("Delete this concern?")) return;

        try {
            const data = await fetchFromAPI(`/concerns/delete/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (data.success) {
                toast.success("Deleted Successfully");
                fetchConcerns();
            }
        } catch (error) {
            toast.error("Delete Failed");
        }
    };


    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                Concern Management
            </h1>

            {/* ADD FORM */}

            <form
                onSubmit={handleSubmit}
                className="bg-white border rounded-lg p-5 mb-8 space-y-4"
            >
                <input
                    type="text"
                    placeholder="Concern Name"
                    className="border p-3 rounded w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Priority"
                    className="border p-3 rounded w-full"
                    value={priority}
                    onChange={(e) =>
                        setPriority(e.target.value)
                    }
                />

                <input
                    type="file"
                    onChange={(e) =>
                        setImage(e.target.files[0])
                    }
                />

                {/* Categories */}

                <div>
                    <h3 className="font-semibold mb-2">
                        Related Categories
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                            <label
                                key={cat._id}
                                className="flex gap-2 items-center"
                            >
                                <input
                                    type="checkbox"
                                    value={cat._id}
                                    checked={selectedCategories.includes(cat._id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedCategories([
                                                ...selectedCategories,
                                                cat._id,
                                            ]);
                                        } else {
                                            setSelectedCategories(
                                                selectedCategories.filter(
                                                    (id) => id !== cat._id
                                                )
                                            );
                                        }
                                    }}
                                />

                                {cat.name}
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-black text-white px-5 py-2 rounded"
                >
                    {editingId ? "Update Concern" : "Add Concern"}
                </button>
            </form>

            {/* LIST */}

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">
                                Image
                            </th>

                            <th className="p-3 text-left">
                                Concern
                            </th>

                            <th className="p-3 text-left">
                                Priority
                            </th>

                            <th className="p-3 text-left">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {concerns.map((item) => (
                            <tr
                                key={item._id}
                                className="border-t"
                            >
                                <td className="p-3">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-14 h-14 rounded object-cover"
                                    />
                                </td>

                                <td className="p-3">
                                    {item.title}
                                </td>

                                <td className="p-3">
                                    {item.priority}
                                </td>

                                <td className="p-3">
                                    <button
                                        onClick={() =>
                                            deleteConcern(item._id)
                                        }
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(item._id);
                                            setTitle(item.title);
                                            setPriority(item.priority);
                                        }}
                                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {concerns.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-8">
                                    No concerns found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}