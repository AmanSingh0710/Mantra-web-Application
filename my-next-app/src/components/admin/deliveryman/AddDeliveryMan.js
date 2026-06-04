"use client";

import { fetchFromAPI, BASE_URL } from "@/utils/api";
import React, { useState, useRef } from 'react';
import { User, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddDeliveryManPage() {
    const [showPass, setShowPass] = useState(false);
    const deliveryImageRef = useRef(null);
    const identityImageRef = useRef(null);

    const initialState = {
        firstName: '',
        lastName: '',
        phoneCode: '+91',
        phoneNumber: '',
        identityType: 'Passport',
        identityNumber: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [images, setImages] = useState({
        deliveryman_image: null,
        identity_image: null
    });
    const [previews, setPreviews] = useState({
        dmPreview: null,
        idPreview: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Image Upload + Preview
    const handleFileChange = (e) => {
        const { name, files } = e.target;

        if (files && files[0]) {
            setImages(prev => ({ ...prev, [name]: files[0] }));

            const url = URL.createObjectURL(files[0]);

            if (name === "deliveryman_image") {
                setPreviews(p => ({ ...p, dmPreview: url }));
            } else {
                setPreviews(p => ({ ...p, idPreview: url }));
            }
        }
    };

    // Reset
    const handleReset = () => {
        setFormData(initialState);
        setImages({ deliveryman_image: null, identity_image: null });
        setPreviews({ dmPreview: null, idPreview: null });

        if (deliveryImageRef.current) deliveryImageRef.current.value = "";
        if (identityImageRef.current) identityImageRef.current.value = "";
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (!images.deliveryman_image) {
            return toast.error("Deliveryman image is required");
        }

        try {
            const submitData = new FormData();

            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            submitData.append("deliveryman_image", images.deliveryman_image);

            if (images.identity_image) {
                submitData.append("identity_image", images.identity_image);
            }

            await fetchFromAPI("/deliveryman/add-deliveryman", {
                method: "POST",
                body: submitData
            });

            toast.success("Delivery Man Added Successfully ✅");
            handleReset();

        } catch (err) {
            toast.error(err.message || "Server Error");
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F8FA] p-6 font-sans text-[#334257]">
            <div className="flex items-center gap-2 mb-6">
                <img src="https://cdn-icons-png.flaticon.com/512/709/709722.png" alt="icon" className="w-6 h-6" />
                <h1 className="text-xl font-bold text-[#1e293b]">Add New Delivery Man</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
                {/* --- General Information Card --- */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="p-4 border-b flex items-center gap-2 font-semibold text-[#334257]">
                        <User size={18} className="text-gray-500" /> General Information
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        {/* Left Side Inputs */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">First Name</label>
                                <input name="firstName" value={formData.firstName} required placeholder="First Name" className="w-full p-2 border border-gray-200 rounded outline-none focus:border-blue-400" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">Last Name</label>
                                <input name="lastName" value={formData.lastName} required placeholder="Last Name" className="w-full p-2 border border-gray-200 rounded outline-none focus:border-blue-400" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">Phone</label>
                                <div className="flex gap-0 border border-gray-200 rounded overflow-hidden">
                                    <select name="phoneCode" className="bg-gray-50 px-2 border-r text-sm outline-none" onChange={handleChange}>

                                        <option value="+91">IN (+91)</option>
                                    </select>
                                    <input name="phoneNumber" value={formData.phoneNumber} required placeholder="Ex: 9876543210" className="flex-1 p-2 outline-none" onChange={handleChange} />
                                </div>
                            </div>
                            {/* Deliveryman Image Input & Preview */}
                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">
                                    Deliveryman Image * <span className="text-cyan-500 text-[11px]">( Ratio 1:1 )</span>
                                </label>
                                <div className="flex border border-gray-200 rounded overflow-hidden mb-4">
                                    <input readOnly placeholder={images.deliveryman_image ? images.deliveryman_image.name : "Choose File"} className="flex-1 p-2 text-sm text-gray-400 bg-white" />
                                    <label className="bg-gray-100 px-4 py-2 border-l border-gray-200 cursor-pointer text-sm font-medium hover:bg-gray-200">
                                        Browse <input type="file" ref={deliveryImageRef} name="deliveryman_image" hidden accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <div className="w-36 h-36 border border-gray-200 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                                    {previews.dmPreview ? <img src={previews.dmPreview} className="w-full h-full object-cover" alt="Preview" /> : <ImageIcon size={40} className="text-gray-300" />}
                                </div>
                            </div>
                        </div>

                        {/* Right Side Inputs */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">Identity Type</label>
                                <select name="identityType" value={formData.identityType} className="w-full p-2 border border-gray-200 rounded bg-white outline-none" onChange={handleChange}>
                                    <option value="Passport">Passport</option>
                                    <option value="Driving License">Driving License</option>
                                    <option value="NID">NID</option>
                                    <option value="Company ID">Company ID</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">Identity Number</label>
                                <input name="identityNumber" value={formData.identityNumber} required placeholder="Ex:DH-23434-LS" className="w-full p-2 border border-gray-200 rounded outline-none" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">Address</label>
                                <textarea name="address" value={formData.address} placeholder="Address" rows="1" className="w-full p-2 border border-gray-200 rounded outline-none resize-none h-[42px]" onChange={handleChange}></textarea>
                            </div>
                            {/* Identity Image Upload */}
                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">Identity Image</label>
                                <div className="w-full h-48 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center relative overflow-hidden group">
                                    {previews.idPreview ? <img src={previews.idPreview} className="w-full h-full object-contain" alt="ID Preview" /> : <ImageIcon size={48} className="text-gray-200" />}
                                    <input type="file" ref={identityImageRef} name="identity_image" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Account Information Card --- */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="p-4 border-b flex items-center gap-2 font-semibold text-[#334257]">
                        <User size={18} className="text-gray-500" /> Account Information
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm mb-1.5 font-medium text-gray-600">Email</label>
                            <input name="email" value={formData.email} type="email" required placeholder="Ex:ex@example.com" className="w-full p-2 border border-gray-200 rounded outline-none" onChange={handleChange} />
                        </div>
                        <div className="relative">
                            <label className="block text-sm mb-1.5 font-medium text-gray-600 flex items-center gap-1">Password <span className="text-gray-400 text-xs">ⓘ</span></label>
                            <input name="password" value={formData.password} type={showPass ? "text" : "password"} required placeholder="Password minimum 8 characters" className="w-full p-2 border border-gray-200 rounded outline-none" onChange={handleChange} />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-10 text-gray-400">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <div className="relative">
                            <label className="block text-sm mb-1.5 font-medium text-gray-600">Confirm Password</label>
                            <input name="confirmPassword" value={formData.confirmPassword} type={showPass ? "text" : "password"} required placeholder="Password minimum 8 characters" className="w-full p-2 border border-gray-200 rounded outline-none" onChange={handleChange} />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-10 text-gray-400">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={handleReset} className="px-10 py-2 bg-[#F1F3F5] text-[#495057] rounded-md font-semibold hover:bg-gray-200 transition-all">Reset</button>
                    <button type="submit" className="px-10 py-2 bg-[#0067FF] text-white rounded-md font-semibold hover:bg-blue-700 transition-all shadow-md">Submit</button>
                </div>
            </form>
        </div>
    );
}