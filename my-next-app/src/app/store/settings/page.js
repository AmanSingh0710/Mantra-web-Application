"use client";

import { useEffect, useState } from "react";
import {
  fetchFromAPI,
  getImageUrl,
} from "@/utils/api";

import {
  FaStore,
  FaLock,
  FaUniversity,
  FaTruck,
  FaMapMarkerAlt,
  FaGlobe,
  FaCreditCard,
  FaClock,
  FaPalette,
  FaSave,
} from "react-icons/fa";

export default function StoreSettingsPage() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    // ================= STORE INFO =================
    shopName: "",
    email: "",
    mobile: "",
    description: "",

    // ================= PASSWORD =================
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // ================= GST =================
    gstNumber: "",
    panNumber: "",

    // ================= BANK =================
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",

    // ================= SHIPPING =================
    shippingCharge: "",
    freeShippingLimit: "",

    // ================= ADDRESS =================
    address: "",
    city: "",
    state: "",
    pincode: "",

    // ================= SOCIAL LINKS =================
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",

    // ================= PAYMENT =================
    codEnabled: true,
    upiId: "",

    // ================= STORE TIMING =================
    openTime: "",
    closeTime: "",

    // ================= THEME =================
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
  });

  useEffect(() => {
    const getStore = async () => {
      try {
        const data = await fetchFromAPI(
          "/vendor-store/my-store"
        );

        setStore(data);

        setFormData((prev) => ({
          ...prev,
          shopName: data.shopName || "",
          email: data.email || "",
          mobile: data.mobile || "",
          description: data.description || "",
          gstNumber: data.gstNumber || "",
          panNumber: data.panNumber || "",
          bankName: data.bankName || "",
          accountHolderName:
            data.accountHolderName || "",
          accountNumber:
            data.accountNumber || "",
          ifscCode: data.ifscCode || "",
          shippingCharge:
            data.shippingCharge || "",
          freeShippingLimit:
            data.freeShippingLimit || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          youtube: data.youtube || "",
          codEnabled:
            data.codEnabled ?? true,
          upiId: data.upiId || "",
          openTime: data.openTime || "",
          closeTime: data.closeTime || "",
          primaryColor:
            data.primaryColor || "#000000",
          secondaryColor:
            data.secondaryColor || "#ffffff",
        }));
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    getStore();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetchFromAPI(
        `/vendor-store/my-store/update/${store._id}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Store settings updated successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-gray-400 animate-pulse">
        Loading Store Settings...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Store Configuration
          </h1>

          <p className="text-gray-500 mt-2 font-medium">
            Manage your vendor store settings
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-2xl bg-black text-white font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <FaSave /> Save Changes
        </button>
      </div>

      {/* STORE PREVIEW */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="h-48 bg-gray-100 relative">
          <img
            src={getImageUrl(store?.shopBanner)}
            alt="banner"
            className="w-full h-full object-cover"
          />

          <div className="absolute -bottom-12 left-8">
            <img
              src={getImageUrl(store?.shopLogo)}
              alt="logo"
              className="w-24 h-24 rounded-3xl border-4 border-white object-cover bg-white shadow-xl"
            />
          </div>
        </div>

        <div className="p-8 pt-16 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-black">
              {formData.shopName}
            </h2>

            <p className="text-gray-900 mt-2">
              {formData.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full border"
              style={{
                backgroundColor:
                  formData.primaryColor,
              }}
            />

            <div
              className="w-5 h-5 rounded-full border"
              style={{
                backgroundColor:
                  formData.secondaryColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* SETTINGS GRID */}
      <form className="grid grid-cols-1 xl:grid-cols-2 gap-8 text-black">
        <SettingsCard
          title="Store Information"
          icon={<FaStore />}
        >
          <Input
            label="Shop Name"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </SettingsCard>

        <SettingsCard
          title="Change Password"
          icon={<FaLock />}
        >
          <Input
            type="password"
            label="Current Password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
          />

          <Input
            type="password"
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />

          <Input
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </SettingsCard>

        <SettingsCard
          title="GST & Tax Settings"
          icon={<FaUniversity />}
        >
          <Input
            label="GST Number"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
          />

          <Input
            label="PAN Number"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
          />
        </SettingsCard>

        <SettingsCard
          title="Bank Account"
          icon={<FaUniversity />}
        >
          <Input
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
          />

          <Input
            label="Account Holder"
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleChange}
          />

          <Input
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
          />

          <Input
            label="IFSC Code"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
          />
        </SettingsCard>

        <SettingsCard
          title="Shipping Settings"
          icon={<FaTruck />}
        >
          <Input
            label="Shipping Charge"
            name="shippingCharge"
            value={formData.shippingCharge}
            onChange={handleChange}
          />

          <Input
            label="Free Shipping Limit"
            name="freeShippingLimit"
            value={formData.freeShippingLimit}
            onChange={handleChange}
          />
        </SettingsCard>

        <SettingsCard
          title="Store Address"
          icon={<FaMapMarkerAlt />}
        >
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />

          <Input
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />

          <Input
            label="Pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
        </SettingsCard>

        <SettingsCard
          title="Social Links"
          icon={<FaGlobe />}
        >
          <Input
            label="Facebook"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
          />

          <Input
            label="Instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
          />

          <Input
            label="Twitter"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
          />

          <Input
            label="YouTube"
            name="youtube"
            value={formData.youtube}
            onChange={handleChange}
          />
        </SettingsCard>

        <SettingsCard
          title="Payment Methods"
          icon={<FaCreditCard />}
        >
          <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50">
            <div>
              <h3 className="font-bold text-gray-900">
                Cash On Delivery
              </h3>

              <p className="text-sm text-gray-500">
                Allow customers to pay on delivery
              </p>
            </div>

            <input
              type="checkbox"
              name="codEnabled"
              checked={formData.codEnabled}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>

          <Input
            label="UPI ID"
            name="upiId"
            value={formData.upiId}
            onChange={handleChange}
          />
        </SettingsCard>

        <SettingsCard
          title="Store Timing"
          icon={<FaClock />}
        >
          <Input
            type="time"
            label="Open Time"
            name="openTime"
            value={formData.openTime}
            onChange={handleChange}
          />

          <Input
            type="time"
            label="Close Time"
            name="closeTime"
            value={formData.closeTime}
            onChange={handleChange}
          />
        </SettingsCard>

        <SettingsCard
          title="Theme Customization"
          icon={<FaPalette />}
        >
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Primary Color
            </label>

            <input
              type="color"
              name="primaryColor"
              value={formData.primaryColor}
              onChange={handleChange}
              className="w-full h-14 rounded-xl border border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Secondary Color
            </label>

            <input
              type="color"
              name="secondaryColor"
              value={formData.secondaryColor}
              onChange={handleChange}
              className="w-full h-14 rounded-xl border border-gray-200"
            />
          </div>
        </SettingsCard>
      </form>
    </div>
  );
}

function SettingsCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/40 p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-lg">
          {icon}
        </div>

        <h2 className="text-xl font-black text-gray-900">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700">
        {label}
      </label>

      <textarea
        rows={4}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black resize-none"
      />
    </div>
  );
}
