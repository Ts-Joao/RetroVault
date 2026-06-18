import { User } from "@retrovault/core";
import api from "../axios";

export async function createUser(name: string, email: string, password: string): Promise<User> {
    const { data } = await api.post('/users', { name, email, password })
    return data
}

export async function getUserByIdClient(id: string): Promise<User | undefined> {
    const { data } = await api.get(`/users/${id}`)
    return data
}
