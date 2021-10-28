import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class JwtTokensDto {
  @ApiProperty({ description: "Access tokens", type: String })
  @IsNotEmpty()
  @IsString()
  accessToken: string

  @ApiProperty({ description: "Refresh token. Use it to refresh access token", type: String })
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}
