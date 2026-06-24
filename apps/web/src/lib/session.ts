'use client';

const ACCESS_TOKEN_COOKIE = 'access_token';

export function setAccessTokenCookie(token: string) {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Lax; max-age=86400;`;
}

export function getAccessTokenCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const name = `${ACCESS_TOKEN_COOKIE}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

export function clearAccessTokenCookie() {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; Max-Age=0; SameSite=Lax`;
}