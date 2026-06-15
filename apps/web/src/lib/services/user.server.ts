import { User } from "@retrovault/core";
import { getServerApi } from "../axios.server";

export async function getUsers(): Promise<User[]> {
    const api = await getServerApi()
    const { data } = await api.get<User[] | undefined>('/users')
    return data ?? []
}

export async function getUserById(id: string): Promise<User | undefined> {
    const api = await getServerApi()
    const { data } = await api.get(`/users/${id}`)
    return data
}

export async function getSellerById(id: string): Promise<User | undefined> {
    return getUserById(id)
}
