
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { Authorization: `Bearer ${refreshToken}` },
  });

  if (!res.ok) {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userName");
    window.location.href = "/Login";
    return null;
  }

  const data = await res.json();
  localStorage.setItem("token", data.acess_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data.acess_token;
}

function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

function injectHeaders(headers: Headers, token: string) {
  headers.set("Authorization", `Bearer ${token}`);
  const userId = getUserIdFromToken(token);
  if (userId) headers.set("user-id", userId);
}

export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");

  const isFormData = init.body instanceof FormData;

  const headers = new Headers(init.headers ?? {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);

    const userId = getUserIdFromToken(token);
    if (userId) headers.set("user-id", userId);
  }

  // 🚨 REGRA CRÍTICA
  // nunca setar Content-Type para FormData
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) return response;

    const retryHeaders = new Headers(init.headers ?? {});

    retryHeaders.set("Authorization", `Bearer ${newToken}`);

    const userId = getUserIdFromToken(newToken);
    if (userId) retryHeaders.set("user-id", userId);

    return fetch(input, {
      ...init,
      headers: retryHeaders,
    });
  }

  return response;
}