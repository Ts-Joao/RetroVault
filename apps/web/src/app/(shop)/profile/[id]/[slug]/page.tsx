import { getUserById } from "@/services/user";
import ProfileClient from "./ProfileClient";

interface ProfileProps {
    params: Promise<{ id: string, slug: string }>
}

export default async function Profile({ params }: ProfileProps ) {
    const { id } = await params
    const user = await getUserById(id)

    if (!user)
        return <div>Usuário não encontrado!</div>

    return (
        <ProfileClient key={user.id} user={user}/>
    )
}