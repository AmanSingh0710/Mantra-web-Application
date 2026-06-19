export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//src/utils/api.js
export const getImageUrl = (image) => {

  if (!image)
    return "/no-image.png";

  if (
    typeof image === "object"
  ) {
    return image.url;
  }

  return image;
};

// 🔥 Safe logout helper (Refactored to notify backend to sweep HttpOnly cookies)
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

  // 🔹 Build headers cleanly (No more Bearer Token Injection)
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  let res;

  try {
    res = await fetch(url, {
      ...options,
      headers,
      // CRUCIAL: Instructs the browser to automatically attach/receive cookies
      credentials: "include",
    });
  } catch (err) {
    console.error("Network Error:", err);
    throw new Error("Network error. Please try again.");
  }

  // 🔴 Access Token Expired (401) → Silent cookie refresh flow
  if (res.status === 401) {
    try {
      // It reads 'refreshToken' from cookies and sets a fresh 'accessToken' cookie via response headers.
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Sends the HttpOnly refreshToken cookie automatically
      });

      // If the refresh token itself is expired or manipulated, boot the user out
      if (!refreshRes.ok) {
        await logoutUser();
        return;
      }

      // 🔁 Refresh succeeded! Retry the original request immediately.
      // The browser automatically attaches the brand new cookie set by the refresh step.
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
    const message = data?.message || "Something went wrong";
    throw new Error(message);
  }

  return data;
};