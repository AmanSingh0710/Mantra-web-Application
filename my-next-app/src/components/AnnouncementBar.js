// src/components/AnnouncementBar.js

"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/utils/api";

export default function AnnouncementBar() {

  const [announcement, setAnnouncement] =
    useState(null);

  useEffect(() => {

    const loadAnnouncement = async () => {

      try {

        const res = await fetchFromAPI("/announcement/active");

        if (res?.success) {
          setAnnouncement(res.announcement);
        }

      } catch (err) {
        console.log(err);
      }
    };

    loadAnnouncement();

  }, []);

  if (!announcement) return null;

  return (
  <div
    className="w-full py-2 overflow-hidden"
    style={{
      backgroundColor: announcement.backgroundColor || "#131921",
      color: announcement.textColor || "#fff",
    }}
  >
    <marquee
      behavior="scroll"
      direction="left"
      scrollAmount="5"
    >
      <strong>{announcement.title}</strong>
      {" • "}
      {announcement.message}
    </marquee>
  </div>
);
}