//src/utils/auth.js
export const getUser = async () => {
  if (typeof window === "undefined") return null;

  try {
    // Hits the backend server, which validates the secure cookie
    const data = await fetchFromAPI("/auth/me", { method: "GET" });
    
    // If user returns successfully, cache non-sensitive info for fast UI loading
    if (data && data.success) {
      setAuthLocally(data.user);
      return data.user;
    }
    return null;
  } catch (error) {
    console.error("Session verification failed:", error.message);
    // If the token is invalid or expired, clear out stale UI user data
    localStorage.removeItem("user");
    return null;
  }
};

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

export const logout = async () => {
  try {
    // Calls the endpoint to clear backend cookies (res.clearCookie)
    await fetchFromAPI("/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Backend logout route failed to respond:", error.message);
  } finally {
    // Always clear frontend states and redirect, regardless of network status
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/login";
    }
  }
};