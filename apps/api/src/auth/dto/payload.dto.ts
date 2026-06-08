import { Role } from "@prisma/client"

export class PayloadDto {
  sub: string
  email: string
  iat: number
  exp: number
  aud: string
  iss: string
  role: Role
}