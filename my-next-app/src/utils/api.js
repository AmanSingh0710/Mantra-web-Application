// src/utils/api.js
import { BASE_URL } from "./auth";

export const getImageUrl = (image) => {
  if (!image) return "/no-image.png";
  if (typeof image === "object") {
    return image.url;
  }
  return image;
};

// Safe logout helper
export const logoutUser = async () => {
  if (typeof window === "undefined") return;

  try {
    // Inform the backend to clear cookies (res.clearCookie)
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Backend logout failed:", err);
  } finally {
    // Wipe local UI state cache and force redirect
    localStorage.clear();
    window.location.href = "/login";
  }
};

export const fetchFromAPI = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  // 🔹 Build headers cleanly
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  let res;

  try {
    res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Automatically attach/receive cookies
    });
  } catch (err) {
    console.error("Network Error:", err);
    throw new Error("Network error. Please try again.");
  }

  // 🔴 Access Token Expired or Not Found (401)
  if (res.status === 401) {
    // 💡 GUEST SEAMLESS BROWSING FIX:
    // If a guest lands on the site and hits /auth/me, a 401 is normal. 
    // Return null right away so we don't trigger a forced redirect loop.
    if (endpoint === "/auth/me") {
      return null;
    }

    try {
      // Silent cookie refresh flow for actually logged-in users whose token expired
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Sends the HttpOnly refreshToken cookie automatically
      });

      // If the refresh token itself is expired or missing, boot the user out
      if (!refreshRes.ok) {
        throw new Error("Unauthorized");
      }

      // 🔁 Refresh succeeded! Retry the original request immediately.
      res = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    } catch (err) {
      console.error("Refresh failed:", err);
      await logoutUser();
      return;
    }
  }

  // Parse JSON response data safely
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // ❌ Handle API business errors downstream
  if (!res.ok) {
    // If we already returned null above for /auth/me, it won't hit this
    const message = data?.message || "Something went wrong";
    throw new Error(message);
  }

  return data;
};