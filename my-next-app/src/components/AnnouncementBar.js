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

        const res =
          await fetchFromAPI(
            "/announcement/active"
          );

        if (res?.success) {
          setAnnouncement(
            res.announcement
          );
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
      className="
      w-full
      text-center
      py-2
      text-sm
      font-semibold
      tracking-wide
      overflow-hidden
      whitespace-nowrap
      "
      style={{
        backgroundColor:
          announcement.backgroundColor,
        color:
          announcement.textColor,
      }}
    >
      <div className="animate-marquee">
        {announcement.text}
      </div>
    </div>
  );
}