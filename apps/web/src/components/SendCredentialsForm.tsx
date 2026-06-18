import { createUser } from "@/lib/services/user.client";

export type AddUser = {
    name: string
    email: string
    password: string
    cep?: string
}

export async function SendCredentialsForm(data: AddUser) {
  await createUser(data)
}