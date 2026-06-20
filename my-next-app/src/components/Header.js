//src/components/Header.js

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getUser } from "@/utils/api";
import { useRouter } from "next/navigation";
import { FaUser, FaSearch, FaShoppingBag } from "react-icons/fa";
import NotificationBell from "./NotificationBell";
import AnnouncementBar from "@/components/AnnouncementBar";

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();

  const handleUserClick = async () => {

    try {

      const user = await getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      switch (user.role) {
        case "ADMIN":
          router.push("/admin");
          break;

        case "VENDOR":
          router.push("/store");
          break;

        case "DELIVERY":
          router.push("/delivery");
          break;

        default:
          router.push("/account");
      }

    } catch {
      router.push("/login");
    }
  };

  return (
    <>
      <AnnouncementBar />

      <header className="main-header">
        <div className="header-top">
          {/* Left Side Logo */}
          <div className="header-left">
            <Image
              src="/sideogo.avif"
              alt="Brand Secondary Logo"
              width={150}
              height={50}
              priority // High priority for LCP
              className="header-logo-img"
              style={{ height: "auto" }}
            />
          </div>

          {/* Main Center Logo */}
          <Link href="/" className="header-logo" aria-label="Home">
            <Image
              src="/mantar.avif"
              alt="Mantar Official Logo"
              width={150}
              height={50}
              priority
              className="header-logo-img"
              style={{ height: "auto" }}
            />
          </Link>

          {/* Action Icons */}
          <div className="header-icons">
            <Link href="/search" aria-label="Search">
              <FaSearch size={20} />
            </Link>

            <button
              onClick={handleUserClick}
              className="user-btn"
              aria-label="User Account"
            >
              <FaUser size={18} />
              {user?.name && <span className="user-name">{user.name}</span>}
            </button>

            <NotificationBell />

            <Link href="/cart" aria-label="Shopping Cart">
              <FaShoppingBag size={20} />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-bottom" aria-label="Main Navigation">
          {[
            { name: "Shop All", href: "/shop" },
            { name: "Skin", href: "/skin" },
            { name: "Bath & Body", href: "/bath-body" },
            { name: "Hair", href: "/hair" },
            { name: "Men", href: "/men" },
            { name: "Women", href: "/women" },
            { name: "Wedding Edits", href: "/wedding" },
            { name: "Combos", href: "/combos" },
            { name: "Our Story", href: "/story" },
          ].map((item) => (
            <Link key={item.name} href={item.href} className="nav-link">
              {item.name}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}