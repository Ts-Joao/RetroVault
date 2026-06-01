/**
 * authFetch — substituto do fetch() que injeta automaticamente:
 *   - Authorization: Bearer <token>
 *   - user-id: <sub do token>   ← necessário para o ProductsController
 *
 * Também renova o access token automaticamente quando expira (401).
 */

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

  const headers = new Headers(init.headers ?? {});
  if (token) injectHeaders(headers, token);

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) return response;

    injectHeaders(headers, newToken);
    return fetch(input, { ...init, headers });
  }

  return response;
}