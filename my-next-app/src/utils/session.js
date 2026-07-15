// src/utils/session.js

import { fetchFromAPI } from "./api";

// ===============================
// Get Logged-in User
// ===============================
export const getUser = async () => {
  if (typeof window === "undefined") return null;

  try {
    const data = await fetchFromAPI("/auth/me", {
      method: "GET",
    });

    if (data?.success) {
      setAuthLocally(data.user);
      return data.user;
    }

    clearLocalSession();
    return null;
  } catch (error) {
    console.error("Session check failed:", error.message);
    clearLocalSession();
    return null;
  }
};

// ===============================
// Local Storage Helpers
// ===============================
export const getLocalUser = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setAuthLocally = (user) => {
  if (typeof window === "undefined") return;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};

export const clearLocalSession = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("user");
};

// ===============================
// Logout
// ===============================
export const logout = async () => {
  try {
    await fetchFromAPI("/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout failed:", error.message);
  } finally {
    clearLocalSession();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
};