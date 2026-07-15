// src/utils/api.js

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const getImageUrl = (image) => {
  if (!image) return "/no-image.png";
  if (typeof image === "object") {
    return image.url;
  }
  return image;
};


export const downloadFile = async (endpoint, filename) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Download failed");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
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
        credentials: "include",
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

  if (!res.ok) {
    const message = data?.message || "Something went wrong";

    const error = new Error(message);

    error.status = res.status;
    error.code = data?.code;
    error.userId = data?.userId;
    error.data = data;

    throw error;
  }
  return data;
};