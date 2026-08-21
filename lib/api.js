function apiBase() {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("his_token");
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("his_token", token);
  else localStorage.removeItem("his_token");
}

export async function api(path, options = {}) {
  const { cache = "no-store", ...rest } = options;
  const token = getToken();
  const headers = {
    ...(rest.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers || {}),
  };

  const res = await fetch(`${apiBase()}${path}`, {
    ...rest,
    headers,
    credentials: "include",
    cache,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function apiSafe(path, fallback) {
  try {
    return await api(path);
  } catch {
    return fallback;
  }
}
