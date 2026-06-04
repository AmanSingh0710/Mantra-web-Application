"use client";

import { fetchFromAPI } from "@/utils/api";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useVisitor() {
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        todayVisitors: 0,
    });

    useEffect(() => {

        let isMounted = true;

        // ✅ 1. Track visitor (cookie will be set automatically)
        fetchFromAPI(`/visitor/track`, {
            method: "POST",
            credentials: "include",
        });

        // ✅ 2. Get stats
        fetchFromAPI("/visitor/stats", {
            credentials: "include",
        })
            .then((data) => {
                if (isMounted) setStats(data);
            })
            .catch((err) => {
                console.error("Visitor stats error:", err.message);
            });

        // ✅ 3. Socket connection
        const socket = io(process.env.NEXT_PUBLIC_API_URL, {
            withCredentials: true,
        });

        socket.on("onlineUsers", (count) => {
            setOnlineUsers(count);
        });

        return () => socket.disconnect();
    }, []);

    return { onlineUsers, stats };
}