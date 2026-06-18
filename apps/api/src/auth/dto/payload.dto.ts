import { Role } from "@prisma/client"

export class PayloadDto {
  sub: string
  email: string
  name?: string
  slug?: string
  iat: number
  exp: number
  aud: string
  iss: string
  role: Role
}
