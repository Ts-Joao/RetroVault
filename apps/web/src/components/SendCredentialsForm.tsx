import { createUser } from "@/lib/services/user.client";

export async function SendCredentialsForm(name: string, email: string, password: string) {
  const userData = await createUser(name, email, password)
}