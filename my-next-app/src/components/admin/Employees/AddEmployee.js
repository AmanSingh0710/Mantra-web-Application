"use client";

import { fetchFromAPI } from "@/utils/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaUserCircle, FaImage } from "react-icons/fa";

//src/components/admin/Employees/AddEmployee.js

export default function AddEmployee() {
    // Initial state object for easy resetting
    const initialFormState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        identityType: "Passport",
        identityNumber: "",
        address: "",
        employee_image: null, // Added this to store the file object for the label
        identity_image: null
    };

    const [form, setForm] = useState(initialFormState);
    const [EmployeeImage, setEmployeeImage] = useState(null);
    const [identityImage, setIdentityImage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e, setter) => {
        const file = e.target.files[0];
        if (file) {
            // Update the preview
            setter(URL.createObjectURL(file));
            // Update the form state so the "Choose File" text changes
            setForm(prev => ({ ...prev, [e.target.name]: file }));
        }
    };

    // FIX: Reset function to clear React state
    const handleReset = () => {
        setForm(initialFormState);
        setEmployeeImage(null);
        setIdentityImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        // ✅ Append text fields
        Object.keys(form).forEach((key) => {
            if (key !== "employee_image" && key !== "identity_image") {
                data.append(key, form[key]);
            }
        });

        // ✅ Append images
        if (form.employee_image) {
            data.append("employee_image", form.employee_image);
        }

        if (form.identity_image) {
            data.append("identity_image", form.identity_image);
        }

        try {
            await fetchFromAPI("/employees/add", {
                method: "POST",
                body: data,
            });

            toast.success("Employee Added Successfully ✅");
            handleReset();

        } catch (err) {
            toast.error(err.message || "Error ❌");
        }
    };


    return (
        <div className="min-h-screen bg-[#f8f9fb] p-4 md:p-8 text-black">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <FaUser className="text-xl text-gray-800" />
                <h2 className="text-xl font-bold text-[#334257]">Add New Employee</h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Section Title */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <FaUserCircle className="text-gray-500" />
                    <h3 className="text-sm font-bold text-[#334257] uppercase tracking-wider">General Information</h3>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Left Column */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={form.firstName}
                                    placeholder="First Name"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all placeholder:text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={form.lastName}
                                    placeholder="Last Name"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all placeholder:text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                                <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-blue-400">
                                    <select className="bg-gray-50 border-r border-gray-300 px-2 py-2 text-sm outline-none">
                                        <option>IN (+91)</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        placeholder="Ex: 9876543210"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 outline-none placeholder:text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">
                                    Employee Image * <span className="text-cyan-500 text-[11px]">( Ratio 1:1 )</span>
                                </label>

                                <div className="flex border border-gray-200 rounded overflow-hidden mb-4">
                                    <input
                                        readOnly
                                        placeholder={form.employee_image ? form.employee_image.name : "Choose File"}
                                        className="flex-1 p-2 text-sm text-gray-900 bg-white outline-none"
                                    />
                                    <label className="bg-gray-100 px-4 py-2 border-l border-gray-200 cursor-pointer text-sm font-medium hover:bg-gray-200 transition-colors">
                                        Browse
                                        <input
                                            type="file"
                                            name="employee_image"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, setEmployeeImage)}
                                        />
                                    </label>
                                </div>

                                <div className="w-36 h-36 border border-gray-200 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                                    {EmployeeImage ? (
                                        <img
                                            src={EmployeeImage}
                                            className="w-full h-full object-cover"
                                            alt="Preview"
                                        />
                                    ) : (
                                        <FaImage size={40} className="text-gray-300" />
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    placeholder="Email"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all placeholder:text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Identity Type</label>
                                <select
                                    name="identityType"
                                    value={form.identityType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:border-blue-400 outline-none appearance-none bg-no-repeat bg-[right_1rem_center]"
                                >
                                    <option value="Passport">Passport</option>
                                    <option value="Driving License">Driving License</option>
                                    <option value="NID">NID</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Identity Number</label>
                                <input
                                    type="text"
                                    name="identityNumber"
                                    value={form.identityNumber}
                                    placeholder="Ex:DH-23434-LS"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:border-blue-400 outline-none placeholder:text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    placeholder="Address"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:border-blue-400 outline-none placeholder:text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Identity Image</label>
                                <label className="relative block w-full h-48 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden">
                                    <input type="file" name="identity_image" className="hidden" onChange={(e) => handleImageChange(e, setIdentityImage)} />
                                    {identityImage ? (
                                        <img src={identityImage} alt="Identity Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <FaImage className="text-5xl text-gray-200" />
                                        </div>
                                    )}
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    placeholder="password"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all placeholder:text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button Area */}
                    <div className="mt-8 flex justify-end gap-4">
                        {/* FIX: Set type="button" and add onClick */}
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md font-medium hover:bg-gray-200 transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 shadow-md transition-transform active:scale-95"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}