// src/utils/api.js

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const getImageUrl = (image) => {
  if (!image) return "/no-image.png";
  if (typeof image === "object") {
    return image.url;
  }
  return image;
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

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      return null;
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