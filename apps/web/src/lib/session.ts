'use client'

const ACCESS_TOKEN_COOKIE = 'access_token'

export function setAccessTokenCookie(token: string) {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Strict`
}

export function clearAccessTokenCookie() {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; Max-Age=0; SameSite=Strict`
}
