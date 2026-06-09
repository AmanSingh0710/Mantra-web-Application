"use client";

import { BASE_URL } from "@/utils/api";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { FaCloudUploadAlt, FaInfoCircle, FaYoutube, FaGlobe } from "react-icons/fa";
import "react-quill-new/dist/quill.snow.css";

// Rich Text Editor ko dynamic import karna padta hai Next.js mein
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AddProduct() {
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [allCategories, setAllCategories] = useState([]); // Poora data store karne ke liye
    const [categories, setCategories] = useState([]);      // Level 1 ke liye
    const [subCategories, setSubCategories] = useState([]);   // Level 2 ke liye
    const [subSubCategories, setSubSubCategories] = useState([]); // Level 3 ke liye
    const thumbnailRef = useRef(null);
    const [additionalImages, setAdditionalImages] = useState([]); // Array for multiple images
    const additionalImagesRef = useRef(null);
    const [brands, setBrands] = useState([]);
    const [metaImage, setMetaImage] = useState(null);
    const metaImageRef = useRef(null);
    const [stores, setStores] = useState([]);

    // Saare input fields ke liye main state
    const [formData, setFormData] = useState({
        name: "",
        storeId: "",
        category: "",
        subCategory: "",
        subSubCategory: "",
        brand: "",
        productType: "Physical",
        sku: "",
        unit: "pc",
        unitPrice: 0,
        minOrderQty: 1,
        currentStock: 0,
        discountType: "Flat",
        discountAmount: 0,
        taxAmount: 0,
        taxCalculation: "Include with product",
        shippingCost: 0,
        multiplyQty: false,
        videoLink: "",
        metaTitle: "",
        metaDescription: "",
        listingType: "BESTSELLER",
    });

    const [tags, setTags] = useState(""); // Tags ke liye alag state (comma separated input)

    useEffect(() => {

        // Categories fetch karne ke liye
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${BASE_URL}/categories`, {
                    credentials: "include"
                });
                const data = await res.json();
                setAllCategories(data);
                const level1 = data.filter(cat => cat.level === 1);
                setCategories(level1);
            } catch (err) { console.error("Cat Fetch Error:", err); }
        };

        const fetchStores = async () => {
            try {
                const res = await fetch(`${BASE_URL}/stores`, {
                    credentials: "include"
                });
                const data = await res.json();
                setStores(data);
            } catch (err) { console.error("Store Fetch Error:", err); }
        };

        const fetchBrands = async () => {
            try {
                const res = await fetch(`${BASE_URL}/brand`, {
                    credentials: "include"
                });
                const data = await res.json();
                setBrands(data);
            } catch (err) { console.error("Brand Fetch Error:", err); }
        };

        fetchCategories();
        fetchStores();
        fetchBrands();
    }, []);

    // Helper function input change handle karne ke liye
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleMainCategoryChange = (catId) => {
        setFormData({ ...formData, category: catId, subCategory: "", subSubCategory: "" });

        // Level 2 filter karein jiska parent selected catId ho
        const level2 = allCategories.filter(cat => cat.parent?._id === catId || cat.parent === catId);
        setSubCategories(level2);
        setSubSubCategories([]); // Purana data clear karein
    };

    // Jab Sub Category select ho (Level 2 Change)
    const handleSubCategoryChange = (catId) => {
        setFormData({ ...formData, subCategory: catId, subSubCategory: "" });

        // Level 3 filter karein jiska parent selected catId ho
        const level3 = allCategories.filter(cat => cat.parent?._id === catId || cat.parent === catId);
        setSubSubCategories(level3);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        const data = new FormData();

        // 1. Appending Files
        if (thumbnail) data.append("thumbnail", thumbnail);
        additionalImages.forEach(file => data.append("images", file));
        if (metaImage) data.append("metaImage", metaImage);

        // 2. Appending Form Data (With Number Conversion)
        Object.keys(formData).forEach((key) => {
            // Numbers ko convert karke bhejein
            const numberFields = ['unitPrice', 'minOrderQty', 'currentStock', 'discountAmount', 'taxAmount', 'shippingCost'];
            if (numberFields.includes(key)) {
                data.append(key, Number(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
        });

        // 3. Special Fields (Tags & Description)
        data.append("description", description);
        data.append("tags", tags.split(",").map(tag => tag.trim())); // String to Array conversion

        try {
            const res = await fetch(`${BASE_URL}/Adminproducts/add`, {
                method: "POST",
                credentials: "include",
                body: data
            });

            if (res.ok) alert("Product Uploaded!");
            else {
                const err = await res.json();
                alert("Error: " + err.message);
            }
        } catch (err) { console.error(err); }
    };

    //reset form btn
    const handleReset = () => {
        setFormData({
            name: "", category: "", subCategory: "", subSubCategory: "",
            brand: "", productType: "Physical", sku: "", unit: "pc",
            unitPrice: 0, minOrderQty: 1, currentStock: 0,
            discountType: "Flat", discountAmount: 0, taxAmount: 0,
            taxCalculation: "Include with product", shippingCost: 0,
            multiplyQty: false, videoLink: "", metaTitle: "", metaDescription: "",
        });
        setDescription("");
        setThumbnail(null);
        setAdditionalImages([]);
        setMetaImage(null);
        setTags("");
    };

    const generateSKU = (e) => {
        e.preventDefault(); // Page refresh hone se rokein
        const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 digit random number
        const prefix = "PROD";
        const newSKU = `${prefix}-${randomNum}`;

        setFormData({ ...formData, sku: newSKU });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-gray-700 pb-10">
            <div className="space-y-6 text-gray-700 pb-10">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-2xl">📦</span> Add New Product
                    </h1>
                    <button className="bg-cyan-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-cyan-600">
                        Add Info From Gallery
                    </button>
                </div>

                {/* 1. Basic Info Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Name (EN)</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="New Product"
                            className="w-full border rounded-md p-2 outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description (EN)</label>
                        <div className="h-64 overflow-hidden border rounded-md">
                            <ReactQuill theme="snow" value={description} onChange={setDescription} className="h-52" />
                        </div>
                    </div>
                </div>

                {/* 2. General Setup */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-md font-bold mb-4 flex items-center gap-2"><FaInfoCircle className="text-blue-500" /> General setup</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Category */}

                        {/*Top picks  */}
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-xs">DISPLAY IN SECTION (TOP PICKS)</label>
                            <select
                                name="listingType"
                                value={formData.listingType}
                                onChange={handleInputChange}
                                className="border p-2 rounded bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="BESTSELLER">Bestseller (Default)</option>
                                <option value="NEW ARRIVAL">New Arrival</option>
                                <option value="COMBOS">Combos</option>
                            </select>

                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category</label>
                            <select
                                className="w-full border rounded-md p-2 text-sm bg-gray-50 outline-none"
                                value={formData.category}
                                onChange={(e) => handleMainCategoryChange(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                            </select>
                        </div>

                        {/* Sub Category */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Sub Category</label>
                            <select
                                className="w-full border rounded-md p-2 text-sm bg-gray-50 outline-none"
                                value={formData.subCategory}
                                onChange={(e) => handleSubCategoryChange(e.target.value)}
                                disabled={subCategories.length === 0}
                            >
                                <option value="">Select Sub Category</option>
                                {subCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                            </select>
                        </div>

                        {/* Sub Sub Category */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Sub Sub Category</label>
                            <select
                                className="w-full border rounded-md p-2 text-sm bg-gray-50 outline-none"
                                value={formData.subSubCategory}
                                onChange={(e) => setFormData({ ...formData, subSubCategory: e.target.value })}
                                disabled={subSubCategories.length === 0}
                            >
                                <option value="">Select Sub Sub Category</option>
                                {subSubCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                            </select>
                        </div>

                        {/* Store */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Select Store </label>
                            <select
                                name="storeId"
                                required
                                className="w-full border rounded-md p-2 text-sm bg-gray-50 outline-none focus:border-blue-400"
                                value={formData.storeId}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a Store</option>
                                {stores.map(store => (
                                    <option key={store._id} value={store._id}>
                                        {store.shopName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Brand</label>
                            <select
                                name="brand"
                                className="w-full border rounded-md p-2 text-sm bg-gray-50 outline-none"
                                value={formData.brand}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Brand</option>
                                {brands && brands.length > 0 ? (
                                    brands.map((brand) => (
                                        <option key={brand._id} value={brand._id}>
                                            {brand.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No brands found</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Product Type</label>
                            <select className="w-full border rounded-md p-2 text-sm bg-gray-50 outline-none">
                                <option>Physical</option>
                                <option>Digital</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Product SKU <FaInfoCircle className="inline text-gray-400" /></label>
                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 161183"
                                    className="w-full border rounded-md p-2 text-sm outline-none"
                                />
                                <button type="button" onClick={generateSKU} className="text-blue-500 text-xs whitespace-nowrap font-medium cursor-pointer">Generate Code</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Unit</label>
                            <select name="unit" value={formData.unit} onChange={handleInputChange} className="w-full border rounded-md p-2 text-sm bg-gray-50 outline-none">
                                <option value="pc">pc</option>
                                <option value="pcs">pcs</option>
                                <option value="kg">kg</option>
                                <option value="gms">gms</option>
                                <option value="ml">ml</option>
                                <option value="ltr">ltr</option>
                                <option value="pair">pair</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Search Tags <FaInfoCircle className="inline text-gray-400" /></label>
                            <input type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Enter tags (comma separated)"
                                className="w-full border rounded-md p-2 text-sm outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Pricing & Others */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-md font-bold mb-4 flex items-center gap-2">💰 Pricing & others</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { label: "Unit Price (₹)", name: "unitPrice" },
                            { label: "Minimum Order Qty", name: "minOrderQty" },
                            { label: "Current Stock Qty", name: "currentStock" },
                            { label: "Discount Amount (₹)", name: "discountAmount" },
                            { label: "Tax Amount (%)", name: "taxAmount" },
                            { label: "Shipping Cost (₹)", name: "shippingCost" },
                        ].map((item) => (
                            <div key={item.name}>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{item.label} <FaInfoCircle className="inline text-gray-400 text-[10px]" /></label>
                                <input
                                    type="number"
                                    name={item.name}
                                    value={formData[item.name]}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-md p-2 text-sm outline-none"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Discount Type</label>
                            <select className="w-full border rounded-md p-2 text-sm bg-gray-50 outline-none"><option>Flat</option><option>Percent</option></select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Tax Calculation</label>
                            <select className="w-full border rounded-md p-2 text-sm bg-gray-50 outline-none"><option>Include with product</option><option>Exclude</option></select>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <span className="text-sm font-medium">Shipping Cost Multiply With Quantity</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="multiplyQty"
                                checked={formData.multiplyQty}
                                onChange={handleInputChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>
                </div>

                {/* 4. Media Upload Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Thumbnail Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="font-bold mb-4 flex items-center gap-2">
                            Product Thumbnail
                            <span className="text-blue-500 text-xs font-normal underline cursor-pointer">Ratio 1:1</span>
                        </h2>

                        {/* Clickable Area */}
                        <div
                            onClick={() => thumbnailRef.current.click()} // Click trigger logic
                            className="border-2 border-dashed border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition relative"
                        >
                            {/* Agar image select ho gayi hai toh preview dikhayein */}
                            {thumbnail ? (
                                <img src={URL.createObjectURL(thumbnail)} alt="preview" className="h-32 w-32 object-cover rounded" />
                            ) : (
                                <>
                                    <FaCloudUploadAlt className="text-4xl text-gray-300 mb-2" />
                                    <p className="text-sm text-gray-500">Upload Image</p>
                                </>
                            )}

                            {/* Hidden Input File */}
                            <input
                                type="file"
                                ref={thumbnailRef}
                                className="hidden"
                                onChange={(e) => setThumbnail(e.target.files[0])}
                                accept="image/*"
                            />
                        </div>
                    </div>
                    {/* Additional Images Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="font-bold mb-4 flex items-center gap-2">
                            Upload Additional Image
                            <span className="text-blue-500 text-xs font-normal underline cursor-pointer">Ratio 1:1</span>
                        </h2>

                        <div
                            onClick={() => additionalImagesRef.current.click()}
                            className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-wrap gap-3 items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition min-h-[150px]"
                        >
                            {/* Agar images hain to preview dikhayein, nahi to icon */}
                            {additionalImages.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {additionalImages.map((file, index) => (
                                        <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`preview-${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Remove button (Optional) */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
                                                }}
                                                className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1 rounded-bl"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                    {/* Plus icon to add more */}
                                    <div className="w-20 h-20 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xl rounded">
                                        +
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <FaCloudUploadAlt className="text-4xl text-gray-300 mb-2 mx-auto" />
                                    <p className="text-sm text-gray-500">Upload Images</p>
                                </div>
                            )}

                            {/* Hidden Input for Multiple Files */}
                            <input
                                type="file"
                                ref={additionalImagesRef}
                                className="hidden"
                                multiple // Important: multiple files allow karne ke liye
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    setAdditionalImages([...additionalImages, ...files]); // Purani + Nayi images
                                }}
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>

                {/* 5. Video Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-md font-bold mb-4 flex items-center gap-2"><FaYoutube className="text-red-500" /> Product video</h2>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Youtube Video Link <span className="text-cyan-500 font-normal">(Optional please provide embed link not direct link)</span></label>
                    <input type="text" name="videoLink"
                        value={formData.videoLink}
                        onChange={handleInputChange}
                        placeholder="Ex: https://www.youtube.com/embed/6R08LR0UC5E"
                        className="w-full border rounded-md p-2 text-sm outline-none"
                    />
                </div>

                {/* 6. SEO Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-md font-bold mb-4 flex items-center gap-2"><FaGlobe className="text-green-500" /> Seo section</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Meta Title</label>
                                <input type="text"
                                    name="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={handleInputChange}
                                    placeholder="Meta Title"
                                    className="w-full border rounded-md p-2 text-sm outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Meta Description</label>
                                <textarea name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Meta Description"
                                    className="w-full border rounded-md p-2 text-sm outline-none">
                                </textarea>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="block text-xs font-bold text-gray-500 mb-1 self-start">
                                Meta Image <span className="text-blue-500 font-normal underline">Ratio 2:1</span>
                            </label>

                            <div
                                onClick={() => metaImageRef.current.click()} // Trigger hidden input
                                className="border-2 border-dashed border-gray-200 rounded-lg w-full h-full min-h-[150px] flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition overflow-hidden"
                            >
                                {/* Preview Logic */}
                                {metaImage ? (
                                    <img
                                        src={URL.createObjectURL(metaImage)}
                                        alt="meta preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <FaCloudUploadAlt className="text-4xl text-gray-300 mb-2" />
                                        <p className="text-sm text-gray-500">Upload Image</p>
                                    </>
                                )}

                                {/* Hidden Input File */}
                                <input
                                    type="file"
                                    ref={metaImageRef}
                                    className="hidden"
                                    onChange={(e) => setMetaImage(e.target.files[0])}
                                    accept="image/*"
                                />
                            </div>

                            {/* Optional: Remove Button agar image select ho gayi ho */}
                            {metaImage && (
                                <button
                                    onClick={() => setMetaImage(null)}
                                    className="text-xs text-red-500 mt-2 underline"
                                >
                                    Remove Image
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={handleReset} className="px-8 py-2 bg-gray-200 text-gray-600 rounded-md font-medium hover:bg-gray-300">Reset</button>
                    <button type="submit" onClick={(e) => handleSubmit(e)} className="px-8 py-2 bg-[#0084ff] text-white rounded-md font-medium hover:bg-blue-600">Submit</button>
                </div>
            </div>
        </form>
    );
}