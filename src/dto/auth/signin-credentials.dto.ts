import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator"
import { LoginCredentialsDto } from "./login-credentials.dto"

export class SignInCredentialsDto extends LoginCredentialsDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  nickname: string
}
