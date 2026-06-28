"use client";

// src/app/delivery/profile/page.js
import { useEffect, useState } from "react";
import { fetchFromAPI, getImageUrl } from "@/utils/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit states for Form Fields
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Password Update states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchFromAPI("/deliveryBoy/my-profile");
        setProfile(data);
        setName(data.name || "");
        if (data.image) {
          setImagePreview(getImageUrl(data.image));
        }
      } catch (error) {
        console.error("Failed to load profile:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle avatar image picker
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Name & Picture updates
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Create FormData package in case your backend accepts multipart/form-data for image uploads
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Replace with your exact profile update endpoint (e.g., PUT or POST)
      // If your API uses pure JSON, adjust content type packaging accordingly
      await fetchFromAPI("/deliveryBoy/update-profile", {
        method: "PUT",
        body: formData,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      alert(`Update failed: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Submit Password alterations
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    setIsUpdating(true);
    try {
      await fetchFromAPI("/deliveryBoy/update-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
        headers: { "Content-Type": "application/json" },
      });

      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert(`Password update failed: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Breadcrumb Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Your Profile Account</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your delivery agent credentials, system information, and security setup.
          </p>
        </div>

        {/* Multi-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT: Avatar Display & Fixed Stats Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative group">
              <img
                src={imagePreview || "/fallback-avatar.png"}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gray-200 shadow-inner"
                alt="Partner Identity Profile"
              />
              <label htmlFor="avatar-upload" className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange} 
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-4">{profile.name}</h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 mt-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Active Delivery Driver
            </span>

            {/* Quick Informational Metadata Grid */}
            <div className="w-full border-t border-gray-100 mt-6 pt-4 space-y-3 text-left text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Logistics Vehicle</span>
                <span className="font-semibold text-gray-800 uppercase tracking-wide bg-gray-100 px-2 py-0.5 rounded text-xs">
                  {profile.vehicleType || "Not configured"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Email</span>
                <span className="font-medium text-gray-700 truncate max-w-[180px]">{profile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Registered Phone</span>
                <span className="font-medium text-gray-700">{profile.mobile}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Interactive Field Editing & Password Reset Blocks */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Form Section 1: Name and Identity Details */}
            <form onSubmit={handleUpdateProfile} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-base font-bold text-gray-900">Personal Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">Change your visible name and verify image data changes.</p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 font-medium transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                {imageFile && (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 flex items-center justify-between">
                    <span>New picture selected! Press Save Changes to upload permanently.</span>
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(getImageUrl(profile.image)); }} className="font-bold underline text-blue-800 hover:text-blue-900">Reset</button>
                  </div>
                )}
              </div>
              <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs sm:text-sm font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            {/* Form Section 2: Security & Password Management */}
            <form onSubmit={handleUpdatePassword} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-base font-bold text-gray-900">Login & Security</h3>
                <p className="text-xs text-gray-500 mt-0.5">Keep your account safe by updating your password regularly.</p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full text-sm border border-gray-300 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 text-gray-900 text-xs sm:text-sm font-bold px-5 py-2 rounded-lg shadow-sm transition-colors"
                >
                  {isUpdating ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}