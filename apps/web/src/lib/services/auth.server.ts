import { getServerApi } from "../axios.server";

export async function getMe(): Promise<string | null> {
  try {
    const api = await getServerApi();
    const { data } = await api.get<string>('/auth/me');
    return data;
  } catch (error) {
    return null;
  }
}
