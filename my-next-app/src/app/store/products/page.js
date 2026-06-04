"use client";
import { useEffect, useState } from "react";
import { fetchFromAPI, getImageUrl } from "@/utils/api";
import StoreTable from "@/components/store/StoreTable";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";



export default function AddProductPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    slug: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    shortDescription: "",
    description: "",
    thumbnail: null,
    images: [],
  });

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (files) {

      if (name === "images") {

        setFormData({
          ...formData,
          images: files,
        });

      } else {

        setFormData({
          ...formData,
          [name]: files[0],
        });

      }

    } else {

      setFormData({
        ...formData,
        [name]: value,
      });

    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {

        if (key === "images") {

          for (let i = 0; i < formData.images.length; i++) {
            data.append("images", formData.images[i]);
          }

        } else {

          data.append(key, formData[key]);

        }

      });

      await fetchFromAPI("/vendor-store/add", {
        method: "POST",
        body: data,
      });

      router.push("/store/products");

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-black">

      <h1 className="text-3xl font-black mb-8">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl shadow"
      >

        <Input
          label="Product Name"
          name="productName"
          onChange={handleChange}
        />

        <Input
          label="Slug"
          name="slug"
          onChange={handleChange}
        />

        <Input
          label="Category"
          name="category"
          onChange={handleChange}
        />

        <Input
          label="Brand"
          name="brand"
          onChange={handleChange}
        />

        <Input
          label="Price"
          type="number"
          name="price"
          onChange={handleChange}
        />

        <Input
          label="Stock"
          type="number"
          name="stock"
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <label>Description</label>

          <textarea
            name="description"
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
            rows={5}
          />
        </div>

        <div className="md:col-span-2">
          <label>Short Description</label>

          <textarea
            name="shortDescription"
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
            rows={3}
          />
        </div>

        <div>
          <label>Thumbnail</label>

          <input
            type="file"
            name="thumbnail"
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Gallery Images</label>

          <input
            type="file"
            multiple
            name="images"
            onChange={handleChange}
          />
        </div>

        <button
          disabled={loading}
          className="md:col-span-2 bg-black text-white py-4 rounded-2xl font-black"
        >
          {loading
            ? "ADDING..."
            : "ADD PRODUCT"}
        </button>

      </form>
    </div>
  );
}

function Input({ label, ...props }) {

  return (
    <div>
      <label className="block mb-2 font-bold">
        {label}
      </label>

      <input
        {...props}
        className="w-full border p-4 rounded-xl"
      />
    </div>
  );
}