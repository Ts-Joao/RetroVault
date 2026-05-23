import { User } from "@retrovault/core";
import api from "../axios";
import { getServerApi } from "../axios.server";

export async function getUsers(): Promise<User[]> {
    const api = await getServerApi()
    const { data } = await api.get<User[] | undefined>('/users')
    return data ?? []
}

export async function getProductsBySellerId(id: string): Promise<User | undefined> {
    const api = await getServerApi()
    const { data } = await api.get(`/users/${id}`)
    return data
}

export async function getUserById(id: string): Promise<User | undefined> {
    const api = await getServerApi()
    const { data } = await api.get(`/users/${id}`)
    return data
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
    const { data } = await api.post('/users', { name, email, password })
    return data
}
