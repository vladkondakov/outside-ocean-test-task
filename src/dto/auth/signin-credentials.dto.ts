import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator"

import { LoginCredentialsDto } from "./login-credentials.dto"

export class SignInCredentialsDto extends LoginCredentialsDto {
  @ApiProperty({ description: "User nickname. Max length is 30, not empty and unique", type: String })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  nickname: string
}
