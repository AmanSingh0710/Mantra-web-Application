"use client";
//src/components/AddDeliveryMan.js
import { fetchFromAPI } from "@/utils/api";
import React, { useState, useRef } from 'react';
import { User, Eye, EyeOff, Bike, MapPin, CreditCard, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddDeliveryManPage() {
    const [showPass, setShowPass] = useState(false);
    const deliveryImageRef = useRef(null);

    const initialState = {
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",

        vehicleType: "BIKE",
        vehicleNumber: "",
        licenseNumber: "",

        aadhaarNumber: "",

        address: "",
        city: "",
        state: "",
        pincode: "",

        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
    };

    const [formData, setFormData] = useState(initialState);
    const [images, setImages] = useState({
        image: null,
        aadhaarFront: null,
        aadhaarBack: null,
        drivingLicenseImage: null,
        vehicleImage: null,
    });
    const [previews, setPreviews] = useState({
        dmPreview: null,
        aadhaarFrontPreview: null,
        aadhaarBackPreview: null,
        drivingLicensePreview: null,
        vehicleImagePreview: null,
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

            if (name === "image") {
                setPreviews((p) => ({
                    ...p,
                    dmPreview: url,
                }));
            }

            if (name === "aadhaarFront") {
                setPreviews((p) => ({
                    ...p,
                    aadhaarFrontPreview: url,
                }));
            }

            if (name === "aadhaarBack") {
                setPreviews((p) => ({
                    ...p,
                    aadhaarBackPreview: url,
                }));
            }

            if (name === "drivingLicenseImage") {
                setPreviews((p) => ({
                    ...p,
                    drivingLicensePreview: url,
                }));
            }

            if (name === "vehicleImage") {
                setPreviews((p) => ({
                    ...p,
                    vehicleImagePreview: url,
                }));
            }
        }
    };

    // Reset
    const handleReset = () => {
        setFormData(initialState);
        setImages({
            image: null,
            aadhaarFront: null,
            aadhaarBack: null,
            drivingLicenseImage: null,
            vehicleImage: null,
        });
        setPreviews({
            dmPreview: null,
            aadhaarFrontPreview: null,
            aadhaarBackPreview: null,
            drivingLicensePreview: null,
            vehicleImagePreview: null,
        });

    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (!images.image) {
            return toast.error("Delivery Man Image is required");
        }

        try {
            const submitData = new FormData();

            Object.keys(formData).forEach(key => { submitData.append(key, formData[key]); });

            if (images.image) {
                submitData.append("image", images.image);
            }

            if (images.aadhaarFront) {
                submitData.append("aadhaarFront", images.aadhaarFront);
            }

            if (images.aadhaarBack) {
                submitData.append("aadhaarBack", images.aadhaarBack);
            }

            if (images.drivingLicenseImage) {
                submitData.append("drivingLicenseImage", images.drivingLicenseImage);
            }

            if (images.vehicleImage) {
                submitData.append("vehicleImage", images.vehicleImage);
            }

            await fetchFromAPI("/deliveryman/add", {
                method: "POST",
                body: submitData
            });

            toast.success("Delivery Man Added Successfully ✅");
            handleReset();

        } catch (err) {
            toast.error(err.message || "Server Error");
        }
    };

    {/*Upload Box Component*/ }
    const UploadBox = ({ title, name, preview }) => (
        <label className="border-2 border-dashed border-slate-300 rounded-xl h-52 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition overflow-hidden">

            {preview ? (
                <img
                    src={preview}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            ) : (
                <>
                    <ImageIcon className="w-10 h-10 text-slate-400" />
                    <p className="mt-3 text-sm text-slate-600">
                        {title}
                    </p>
                </>
            )}

            <input
                type="file"
                hidden
                name={name}
                onChange={handleFileChange}
            />
        </label>
    );

    return (

        <div className="min-h-screen bg-[#F7F8FA] p-6 font-sans text-[#334257]">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
                <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                        <Bike className="w-7 h-7 text-white" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Add Delivery Partner
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Create and manage delivery executive profiles
                        </p>
                    </div>

                </div>
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
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">Full Name</label>
                                <input name="name" value={formData.name} required placeholder="Name" className="w-full p-2 border border-gray-200 rounded outline-none focus:border-blue-400" onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">mobile</label>
                                <div className="flex gap-0 border border-gray-200 rounded overflow-hidden">
                                    <select name="phoneCode" className="bg-gray-50 px-2 border-r text-sm outline-none" onChange={handleChange}>

                                        <option value="+91">IN (+91)</option>
                                    </select>
                                    <input name="mobile" value={formData.mobile} maxLength={10} pattern="[0-9]{10}" required placeholder="Ex: 9876543210" className="flex-1 p-2 outline-none" onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">Email</label>
                                <input name="email" value={formData.email} type="email" required placeholder="Ex:ex@example.com" className="w-full p-2 border border-gray-200 rounded outline-none" onChange={handleChange} />
                            </div>

                            <div className="relative">
                                <label className="block text-sm mb-1.5 font-medium text-gray-600 flex items-center gap-1">Password <span className="text-gray-400 text-xs">ⓘ</span></label>
                                <input name="password" value={formData.password} type={showPass ? "text" : "password"} required placeholder="Password minimum 8 characters" className="w-full p-3 pr-10 border border-gray-200 rounded-xl outline-none" onChange={handleChange} />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <div className="relative">
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">Confirm Password</label>
                                <input name="confirmPassword" value={formData.confirmPassword} type={showPass ? "text" : "password"} required placeholder="Password minimum 8 characters" className="w-full p-3 pr-10 border border-gray-200 rounded outline-none" onChange={handleChange} />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Deliveryman Image Input & Preview */}
                            <div>
                                <label className="block text-sm mb-1.5 font-medium text-gray-600">
                                    Deliveryman Image * <span className="text-cyan-500 text-[11px]">( Ratio 1:1 )</span>
                                </label>
                                <div className="flex border border-gray-200 rounded overflow-hidden mb-4">
                                    <input readOnly placeholder={images.image?.name || "Choose File"} className="flex-1 p-2 text-sm text-gray-400 bg-white" />
                                    <label className="bg-gray-100 px-4 py-2 border-l border-gray-200 cursor-pointer text-sm font-medium hover:bg-gray-200">
                                        Browse <input type="file" ref={deliveryImageRef} name="image" hidden accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <div className="w-36 h-36 border border-gray-200 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                                    {previews.dmPreview ? <img src={previews.dmPreview} className="w-full h-full object-cover" alt="Preview" /> : <ImageIcon size={40} className="text-gray-300" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Vehicle Section*/}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div className="px-6 py-4 border-b">
                        <h2 className="font-semibold text-lg">
                            <Bike size={18} />
                            Vehicle Information
                        </h2>
                    </div>

                    <div className="p-6 grid md:grid-cols-3 gap-5">

                        <select
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            className="border rounded-xl p-3"
                        >
                            <option value="BIKE">Bike</option>
                            <option value="SCOOTER">Scooter</option>
                            <option value="BICYCLE">Bicycle</option>
                            <option value="CAR">Car</option>
                        </select>

                        <input
                            name="vehicleNumber"
                            placeholder="Vehicle Number"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            className="border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />

                        <input
                            name="licenseNumber"
                            placeholder="License Number"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            className="border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />

                    </div>
                </div>

                {/*KYC Section*/}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="px-6 py-4 border-b">
                        <h2 className="font-semibold text-lg">
                            <ShieldCheck size={18} />
                            KYC Verification
                        </h2>
                    </div>

                    <div className="p-6">

                        <input
                            name="aadhaarNumber"
                            placeholder="Aadhaar Number"
                            value={formData.aadhaarNumber}

                            maxLength={12}
                            pattern="[0-9]{12}"
                            onChange={handleChange}
                            className="w-full border rounded-xl p-3 mb-5"
                        />

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

                            <UploadBox title="Aadhaar Front" name="aadhaarFront" preview={previews.aadhaarFrontPreview}
                            />

                            <UploadBox title="Aadhaar Back" name="aadhaarBack" preview={previews.aadhaarBackPreview}
                            />

                            <UploadBox title="Driving License" name="drivingLicenseImage" preview={previews.drivingLicensePreview}
                            />

                            <UploadBox title="Vehicle Image" name="vehicleImage" preview={previews.vehicleImagePreview}
                            />

                        </div>

                    </div>
                </div>

                {/*Address Section*/}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="px-6 py-4 border-b">
                        <h2 className="font-semibold text-lg">
                            <MapPin size={18} />
                            Address Information
                        </h2>
                    </div>

                    <div className="p-6 grid md:grid-cols-2 gap-5">

                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="border rounded-xl p-3"
                        />

                        <input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                            className="border rounded-xl p-3"
                        />

                        <input
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State"
                            className="border rounded-xl p-3"
                        />

                        <input
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="Pincode"
                            className="border rounded-xl p-3"
                        />

                    </div>
                </div>

                {/*Bank Section*/}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="px-6 py-4 border-b">
                        <h2 className="font-semibold text-lg">
                            <CreditCard size={18} />
                            Settlement Information
                        </h2>
                    </div>

                    <div className="p-6 grid md:grid-cols-2 gap-5">

                        <input
                            name="bankName"
                            placeholder="Bank Name"
                            value={formData.bankName}
                            onChange={handleChange}
                            className="border rounded-xl p-3"
                        />

                        <input
                            name="accountHolderName"
                            placeholder="Account Holder Name"
                            value={formData.accountHolderName}
                            onChange={handleChange}
                            className="border rounded-xl p-3"
                        />

                        <input
                            name="accountNumber"
                            placeholder="Account Number"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            className="border rounded-xl p-3"
                        />

                        <input
                            name="ifscCode"
                            placeholder="IFSC Code"
                            value={formData.ifscCode}
                            onChange={handleChange}
                            className="border rounded-xl p-3"
                        />

                        <input
                            name="upiId"
                            placeholder="UPI ID"
                            value={formData.upiId}
                            onChange={handleChange}
                            className="border rounded-xl p-3"
                        />

                    </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">

                    <button type="button" onClick={handleReset} className="px-6 py-3 rounded-xl border">
                        Reset
                    </button>

                    <button type="submit" className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all">
                        Save Delivery Partner
                    </button>

                </div>
            </form>
        </div>
    );
}