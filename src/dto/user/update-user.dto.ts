import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator"

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d$!%*?&]{3,100}$/

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsOptional()
  @Matches(passwordRegex, { message: "Password must include at least one upper case, one lower case and one number" })
  password: string

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  nickname: string
}
