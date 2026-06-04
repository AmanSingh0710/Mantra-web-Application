"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFromAPI } from "@/utils/api";
import { FaCloudUploadAlt, FaStore, FaUserEdit } from "react-icons/fa";

export default function AddStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", mobile: "", email: "",
    password: "", confirmPassword: "", shopName: "", shopAddress: "",
    vendorImage: null, shopLogo: null, shopBanner: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match");

    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));

      await fetchFromAPI("/vendor-store/add", { method: "POST", body: formData });
      router.push("/vendor-store");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Onboard New Store</h1>
        <p className="text-gray-500">Add a new vendor and their branding assets</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
        
        {/* Personal Details */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex items-center gap-2 text-gray-400 border-b pb-2">
            <FaUserEdit /> <span className="text-xs font-black uppercase tracking-widest">Personal Info</span>
          </div>
          <Input label="First Name" name="firstName" onChange={handleChange} required />
          <Input label="Last Name" name="lastName" onChange={handleChange} required />
          <Input label="Mobile Number" name="mobile" onChange={handleChange} required />
          <Input label="Email Address" name="email" type="email" onChange={handleChange} required />
          <Input label="Password" name="password" type="password" onChange={handleChange} required />
          <Input label="Confirm Password" name="confirmPassword" type="password" onChange={handleChange} required />
        </section>

        {/* Shop Details */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex items-center gap-2 text-gray-400 border-b pb-2">
            <FaStore /> <span className="text-xs font-black uppercase tracking-widest">Shop Branding</span>
          </div>
          <div className="md:col-span-2">
            <Input label="Shop Name" name="shopName" onChange={handleChange} required />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Shop Address</label>
            <textarea name="shopAddress" onChange={handleChange} required className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black h-24 outline-none" />
          </div>
          
          <FileField label="Vendor Photo" name="vendorImage" onChange={handleChange} />
          <FileField label="Shop Logo" name="shopLogo" onChange={handleChange} />
          <div className="md:col-span-2">
            <FileField label="Shop Banner" name="shopBanner" onChange={handleChange} />
          </div>
        </section>

        <button disabled={loading} className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200 disabled:bg-gray-400">
          {loading ? "PROCESSING..." : "CREATE STORE ACCOUNT"}
        </button>
      </form>
    </div>
  );
}

/* Internal Components for Cleaner Code */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">{label}</label>
      <input {...props} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all" />
    </div>
  );
}

function FileField({ label, name, onChange }) {
  return (
    <div className="relative group">
      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">{label}</label>
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-black transition-colors cursor-pointer">
        <FaCloudUploadAlt className="text-2xl text-gray-300 group-hover:text-black" />
        <span className="text-sm text-gray-500 font-bold">Choose File</span>
        <input type="file" name={name} onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>
    </div>
  );
}