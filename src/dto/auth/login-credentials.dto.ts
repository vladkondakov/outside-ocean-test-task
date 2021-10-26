import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator"

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d$!%*?&]{3,100}$/

export class LoginCredentialsDto {
  @IsString()
  @MaxLength(100)
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Matches(passwordRegex, { message: "Password must include at least one upper case, one lower case and one number" })
  password: string
}
