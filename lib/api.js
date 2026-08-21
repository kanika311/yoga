function apiBase() {
  // Browser:
  // Use the current website domain automatically.
  if (typeof window !== "undefined") {
    return "";
  }

  // Server-side requests only.
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  );
}

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("his_token");
}

export function setToken(token) {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    localStorage.setItem("his_token", token);
  } else {
    localStorage.removeItem("his_token");
  }
}

export async function api(path, options = {}) {
  const {
    cache = "no-store",
    headers: customHeaders = {},
    ...rest
  } = options;

  const token = getToken();

  const isFormData =
    typeof FormData !== "undefined" &&
    rest.body instanceof FormData;

  const headers = {
    // Only add JSON content type when body is NOT FormData
    ...(!isFormData && rest.body
      ? {
          "Content-Type": "application/json",
        }
      : {}),

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),

    ...customHeaders,
  };

  const res = await fetch(`${apiBase()}${path}`, {
    ...rest,
    headers,
    credentials: "include",
    cache,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(
      data.message || "Request failed"
    );

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