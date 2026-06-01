import { createUser } from "@/lib/services/user.service";

export async function SendCredentialsForm(name: string, email: string, password: string) {
  const userData = await createUser(name, email, password)
}