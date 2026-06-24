"use client";

import {useEffect,useState,} from "react";

import {fetchFromAPI,getImageUrl,} from "@/utils/api";

import DeliveryCard from "@/components/delivery/DeliveryCard";

import {Package,Wallet,CheckCircle2,Clock3,} from "lucide-react";

export default function DashboardPage() {

  const [stats, setStats] =
    useState({});

  const [profile, setProfile] =
    useState({});

  useEffect(() => {

    const fetchData = async () => {

      try {

        const statsData =
          await fetchFromAPI(
            "/delivery-boy/my-stats"
          );

        const profileData =
          await fetchFromAPI(
            "/delivery-boy/my-profile"
          );

        setStats(statsData);

        setProfile(profileData);

      } catch (error) {

        console.log(error.message);

      }
    };

    fetchData();

  }, []);

  return (
    <div className="space-y-8">

      {/* HERO */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[2.5rem]
          bg-gradient-to-r
          from-black
          via-zinc-900
          to-orange-500
          p-8
          text-white
          shadow-2xl
        "
      >

        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">

          <div className="flex items-center gap-6">

            <img
              src={getImageUrl(profile.image)}
              alt="profile"
              className="
                w-28
                h-28
                rounded-3xl
                object-cover
                border-4
                border-white/20
                shadow-2xl
              "
            />

            <div>

              <h1 className="text-4xl font-black tracking-tight">
                Welcome Back 👋
              </h1>

              <h2 className="text-2xl font-bold mt-2">
                {profile.name}
              </h2>

              <p className="text-white/70 mt-2">
                {profile.email}
              </p>

              <div className="mt-4 flex items-center gap-3">

                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Active
                </span>

                <span className="bg-white/10 px-4 py-1 rounded-full text-sm font-bold">
                  Delivery Partner
                </span>

              </div>

            </div>

          </div>

          {/* WALLET */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-w-[260px]">

            <p className="text-white/70 font-semibold">
              Wallet Balance
            </p>

            <h2 className="text-5xl font-black mt-3">
              ₹{stats.walletBalance || 0}
            </h2>

            <p className="text-green-300 mt-3 font-bold">
              +12% this month
            </p>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DeliveryCard
          title="Total Deliveries"
          value={stats.totalDeliveries || 0}
          icon={<Package />}
          color="bg-gradient-to-br from-orange-500 to-yellow-400"
          growth="+18%"
        />

        <DeliveryCard
          title="Pending Orders"
          value={stats.pendingOrders || 0}
          icon={<Clock3 />}
          color="bg-gradient-to-br from-blue-500 to-cyan-400"
          growth="+6%"
        />

        <DeliveryCard
          title="Completed"
          value={stats.completedOrders || 0}
          icon={<CheckCircle2 />}
          color="bg-gradient-to-br from-green-500 to-emerald-400"
          growth="+22%"
        />

        <DeliveryCard
          title="Total Earnings"
          value={`₹${stats.totalEarnings || 0}`}
          icon={<Wallet />}
          color="bg-gradient-to-br from-purple-500 to-pink-500"
          growth="+31%"
        />

      </div>

    </div>
  );
}