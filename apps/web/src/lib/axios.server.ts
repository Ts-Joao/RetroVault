import axios from "axios";
import { cookies } from "next/headers";

export async function getServerApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: token ? { Cookie: `access_token=${token}` } : {},
  });
}