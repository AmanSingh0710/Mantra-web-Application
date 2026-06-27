"use client";

import {useEffect,useState,} from "react";

import {fetchFromAPI,getImageUrl,} from "@/utils/api";
//src/app/delivery
export default function ProfilePage() {

  const [profile, setProfile] =
    useState({});

  useEffect(() => {

    const fetchProfile =async () => {

      try {

        const data =await fetchFromAPI("/delivery-boy/my-profile");

        setProfile(data);

      } catch (error) {

        console.log(error.message);

      }
    };

    fetchProfile();

  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">

      <div className="flex items-center gap-6">

        <img
          src={getImageUrl(profile.image)}
          className="w-32 h-32 rounded-full object-cover border"
          alt="profile"
        />

        <div>

          <h1 className="text-4xl font-black text-gray-900">
            {profile.name}
          </h1>

          <p className="text-gray-500 mt-2">
            {profile.email}
          </p>

          <p className="text-gray-500">
            {profile.mobile}
          </p>

          <p className="text-gray-500">
            {profile.vehicleType}
          </p>

        </div>

      </div>

    </div>
  );
}