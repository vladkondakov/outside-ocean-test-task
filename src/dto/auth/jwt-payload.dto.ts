export class JwtPayload {
  uid: string
  email: string
  nickname: string
  iat?: number
  exp?: number
}
