import { IsNotEmpty, IsString } from "class-validator"

export class JwtTokensDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string

  @IsString()
  @IsNotEmpty()
  refreshToken: string
}
