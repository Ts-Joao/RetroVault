import api from "../axios";
import { User } from "@retrovault/core";

type AddUser = {
    name: string
    email: string
    password: string
    phone: string
    cep?: string
}

export async function createUser(userData: AddUser): Promise<AddUser> {
    const { data } = await api.post('/users', {userData})
    return data
}

export async function getUserByIdClient(id: string): Promise<User | undefined> {
    const { data } = await api.get(`/users/${id}`)
    return data
}
