import axios from "axios";
import {deleteAllCookies} from "../utils/cookies";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.withCredentials = true;

// -----------------------------
// Refresh Token
// -----------------------------
async function refreshAccessToken() {
  try {
    await axios.post("/api/v1/auth/refresh", {}, { withCredentials: true });
    return true;
  } catch (err) {
    console.error("❌ Refresh failed:", err);
    return false;
  }
}

// -----------------------------
// Handle 401 → refresh → retry
// -----------------------------
async function handleUnauthorized(originalConfig) {
  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    deleteAllCookies();
    window.location.href = "/login";
    throw new Error("Unauthorized: refresh failed");
  }

  try {
    // clone config safely (drop internal stuff)
    const cleanConfig = {
      ...originalConfig,
      headers: { ...originalConfig.headers }, // clone plain headers only
      withCredentials: true,
    };

    const retryResponse = await axios.request(cleanConfig);
    return retryResponse.data;
  } catch (retryErr) {
    console.error("❌ Retry after refresh failed:", retryErr);
    deleteAllCookies();
    window.location.href = "/login";
    throw retryErr;
  }
}

// -----------------------------
// Generic API Wrapper
// -----------------------------
async function apiCall(config, skipRefresh = false) {
  try {
    const response = await axios.request({ ...config, withCredentials: true });
    return response.data;
  } catch (err) {
    // never refresh for login API
    if (config.url === "/api/v1/auth/login" || skipRefresh) {
      throw err;
    }
    if (err.response?.status === 401) {
      return await handleUnauthorized(err.config);
    }

    throw err;
  }
}

// -----------------------------
// Public API Functions
// -----------------------------
export function getCall(url, params) {
  return apiCall({ method: "get", url, params });
}

export function postCall(url, data) {
  return apiCall({ method: "post", url, data });
}

export function postMediaCall(url, data) {
  return apiCall({
    method: "post",
    url,
    data,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function putCall(url, data) {
  return apiCall({ method: "put", url, data });
}

export function deleteCall(url) {
  return apiCall({ method: "delete", url });
}

// -----------------------------
// Cancelable Promise
// -----------------------------
export function makeCancelable(promise) {
  let isCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then((val) => !isCanceled && resolve(val))
      .catch((error) => !isCanceled && reject(error));
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
}
