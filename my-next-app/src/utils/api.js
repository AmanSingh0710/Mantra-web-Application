export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getImageUrl = (image) => {
  if (!image) return "/no-image.png";

  if (image.startsWith("http")) {
    return image;
  }

  // Fallback: Sirf purane local database entries ke liye backend port lgao
  let cleanPath = image.replace(/\\/g, "/");
  if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
  if (cleanPath.startsWith("/uploads")) return `${BASE_URL}${cleanPath}`;

  return `${BASE_URL}/uploads${cleanPath}`;
};

// 🔥 Safe logout helper (reusable inside API layer)
export const logoutUser = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  window.location.href = "/login";
};

export async function fetchFromAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  let accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const refreshToken =
    typeof window !== "undefined"
      ? localStorage.getItem("refreshToken")
      : null;

  // 🔹 Build headers properly
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  // 🔹 First request
  let res;

  try {
    res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch (err) {
    console.error("Network Error:", err);
    throw new Error("Network error. Please try again.");
  }

  // 🔴 Token expired → refresh flow
  if (res.status === 401 && refreshToken) {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
      });

      if (!refreshRes.ok) {
        logoutUser();
        return;
      }

      const refreshData = await refreshRes.json();

      if (!refreshData?.accessToken) {
        logoutUser();
        return;
      }

      // Save New Token
      localStorage.setItem(
        "accessToken",
        refreshData.accessToken
      );

      // 🔁 Retry original request
      res = await fetch(url, {
        ...options,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(options.headers || {}),
          Authorization: `Bearer ${refreshData.accessToken}`,
        },
        credentials: "include",
      });
    } catch (err) {
      console.error("Refresh failed:", err);
      logoutUser();
      return;
    }
  }


   let data = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // ❌ Handle API errors
  if (!res.ok) {
    const message =
      data?.message || "Something went wrong";


    throw new Error(message);
  }

  return data;
}
