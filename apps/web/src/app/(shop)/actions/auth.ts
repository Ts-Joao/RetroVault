"use client"

import api from "@/lib/axios"

export async function login(email: string, password: string) {
    await api.post('auth/login', { email, password })
}

export async function logout() {
    await api.post('auth/logout')
}