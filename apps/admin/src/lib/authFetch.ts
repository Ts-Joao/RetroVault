export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem("token");

  // Se o body for FormData, NÃO define Content-Type
  // O browser define automaticamente com o boundary correto
  const isFormData = init.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(init.headers as Record<string, string> ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    const refreshed = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshed.ok) {
      const data = await refreshed.json();
      const newToken = data.accessToken;
      localStorage.setItem("token", newToken);

      return fetch(input, {
        ...init,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
        credentials: "include",
      });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      window.location.href = "/";
    }
  }

  return response;
}