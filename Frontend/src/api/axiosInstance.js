import axios from "axios";

// NOTE: The backend uses HTTP-only cookie auth (accessToken + refreshToken).
// We MUST use withCredentials: true on every request so the browser sends cookies.
// We do NOT set Authorization headers — the backend ignores them.
//
// The Next.js rewrites in next.config.mjs proxy /api/* → backend, so cookies
// are always same-origin and sameSite: "strict" is not a problem.

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true, // always send cookies
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// ─── Response interceptor ─────────────────────────────────────────────────────
// On 401: attempt a token refresh once, then retry the original request.
// If refresh also fails, clear auth state and redirect to /login.

let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Avoid infinite loop for refresh endpoint itself
    if (
      status === 401 &&
      !original._retry &&
      !original.url?.includes("/auth/refresh-token") &&
      !original.url?.includes("/auth/login")
    ) {
      if (isRefreshing) {
        // Queue subsequent 401s while a refresh is in flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        // Attempt refresh — uses the refreshToken HTTP-only cookie automatically
        await axiosInstance.post("/auth/refresh-token");
        processQueue(null);
        return axiosInstance(original);
      } catch (refreshError) {
        processQueue(refreshError);

        // Clear frontend auth state and redirect to login
        if (typeof window !== "undefined") {
          // Dynamically import to avoid SSR issues
          import("@/store/authStore").then(({ useAuthStore }) => {
            useAuthStore.getState().logout();
          });
          import("@/lib/queryClient").then(({ queryClient }) => {
            queryClient.clear();
          });
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Surface 5xx errors via toast (non-SSR only)
    if (status && status >= 500 && typeof window !== "undefined") {
      import("sonner").then(({ toast }) => {
        toast.error("Server error. Please try again later.");
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
