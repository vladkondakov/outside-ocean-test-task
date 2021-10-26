import { IsString } from "class-validator"

export class JwtTokensDto {
  @IsString()
  accessToken: string

  @IsString()
  refreshToken: string
}
