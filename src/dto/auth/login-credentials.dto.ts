import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator"

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d$!%*?&]{3,100}$/

export class LoginCredentialsDto {
  @ApiProperty({ example: "test@gmail.com", description: "User email. Must be an email. Not empty and max length is 100", type: String })
  @IsString()
  @MaxLength(100)
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: "Qwerty1!", description: "Password must include at least one upper case, one lower case and one number", type: String })
  @Matches(passwordRegex, { message: "Password must include at least one upper case, one lower case and one number" })
  password: string
}
