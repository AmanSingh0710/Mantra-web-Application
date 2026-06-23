"use client";

import { useAuth } from "@/context/AuthContext";
import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,FaHashtag, FaSignOutAlt, FaCamera, FaShieldAlt, FaSave, FaEdit} from "react-icons/fa";
//src/app/account/apge.js
export default function MyAccount() {
  const router = useRouter();

  const { user, loading: authLoading, refreshUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgSrc, setImgSrc] = useState("/default-avatar.png");


  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);


  //page protected
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  if (!user) return null;




  // ✅ IMAGE HANDLING FIX
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setImgSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (user?.image) {
      setImgSrc(
        user.image.startsWith("http")
          ? user.image
          : `${BASE_URL}${user.image}`
      );
    } else {
      setImgSrc("/default-avatar.png");
    }
  }, [selectedImage, user]);

  // ✅ FETCH PROFILE FROM SERVER
  const fetchFreshData = async () => {
    try {
      if (!user?._id) return;

      const data = await fetchFromAPI(`/auth/profile/${user._id}`);

      setFormData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  // ✅ UPDATE PROFILE
  const handleUpdate = async () => {
    if (!user?.id) return toast.error("User ID missing");

    setSaving(true);

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      if (selectedImage) {
        form.append("image", selectedImage);
      }

      const data = await fetchFromAPI(`/auth/user/${user.id}`, {
        method: "PATCH",
        body: form,
      });

      const updatedUser = data.user;

      const normalizedUser = {
        ...updatedUser,
        id: updatedUser._id,
      };

      await refreshUser();
      setFormData(normalizedUser);

      setSelectedImage(null);
      setIsEditing(false);

      toast.success("Profile updated!");

      // ❌ No need to refetch (optimization)
      // fetchFreshData();

    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  if (!user) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="h-32 bg-[#2874f0] w-full"></div>

      <div className="max-w-5xl mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center border border-gray-100">
              <div className="relative group">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">

                  <img
                    src={imgSrc}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => {
                      if (imgSrc !== "/default-avatar.png") {
                        setImgSrc("/default-avatar.png"); // ✅ prevent loop
                      }
                    }}
                  />

                </div>

                {/* ✅ CAMERA UPLOAD BUTTON */}
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow border text-black hover:text-blue-600 cursor-pointer">
                  <FaCamera size={12} />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                </label>
              </div>

              <h2 className="mt-4 font-bold text-lg text-black">{user.name}</h2>

              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {user.role} Account
              </span>
            </div>


            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`w-full text-left p-4 text-black hover:bg-gray-50 flex items-center gap-3 text-sm font-medium border-b border-gray-50 ${isEditing ? 'text-blue-600 bg-blue-50' : ''}`}
              >
                <FaEdit /> {isEditing ? "Viewing Profile" : "Edit Profile"}
              </button>
              <button onClick={logout} className="w-full text-left p-4 hover:bg-red-50 flex items-center gap-3 text-sm font-bold text-red-500">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaShieldAlt className="text-green-500" /> Personal Details {isEditing && <span className="text-xs font-normal text-blue-500">(Editing Mode)</span>}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 text-black">
                {/* Dynamic Fields */}
                {[
                  { label: "Full Name", name: "name", value: formData.name, icon: <FaUser /> },
                  { label: "Email Address", name: "email", value: formData.email, icon: <FaEnvelope /> },
                  { label: "Mobile Number", name: "mobile", value: formData.mobile, icon: <FaPhone /> },
                  { label: "PIN Code", name: "pin", value: formData.pin, icon: <FaHashtag /> },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{item.label}</p>
                    <div className="flex items-center gap-2 text-gray-900 font-semibold border-b border-gray-100 pb-2">
                      <span className="text-blue-500 text-xs">{item.icon}</span>
                      {isEditing ? (
                        <input
                          name={item.name}
                          value={item.value || ""}
                          onChange={handleInputChange}
                          className="w-full outline-none bg-blue-50 px-2 py-1 rounded"
                        />
                      ) : (
                        <span>{user[item.name] || "Not provided"}</span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Address (Full Width) */}
                <div className="md:col-span-2 space-y-1 pt-4">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Saved Address</p>
                  <div className="flex items-start gap-2 text-gray-800 font-semibold bg-gray-50 p-4 rounded-lg">
                    <FaMapMarkerAlt className="text-red-500 mt-1" size={14} />
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address || ""}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-200 rounded p-2 text-sm font-normal outline-none focus:border-blue-500"
                        rows="2"
                      />
                    ) : (
                      <span>{user.address || "Please add your delivery address"}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition shadow-lg shadow-green-200"
                    >
                      <FaSave /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); setFormData(user); }}
                      className="px-6 py-2 border border-gray-300 font-bold rounded text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-[#2874f0] text-white font-bold rounded hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                  >
                    Update Profile
                  </button>
                )}

                {!user?.isMobileVerified && (
                  <button
                    onClick={() => router.push("/verify-mobile")}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Verify Mobile Number
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}