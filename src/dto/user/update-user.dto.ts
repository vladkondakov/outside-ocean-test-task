import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator"

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d$!%*?&]{3,100}$/

export class UpdateUserDto {
  @ApiProperty({ example: "example@gmail.com", description: "Optional. Must be an email. Max length is 100", type: String })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  email?: string

  @ApiProperty({ description: "New password. Must contain at least one lowercase letter, one uppercase letter and one number", type: String })
  @IsOptional()
  @Matches(passwordRegex, { message: "Password must include at least one upper case, one lower case and one number" })
  password?: string

  @ApiProperty({ example: "nickname", description: "New nickname", type: String })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  nickname?: string
}
