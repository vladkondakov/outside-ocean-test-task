import { Optional } from "@nestjs/common"
import { IsString } from "class-validator"

export class UserDto {
  uid: string
  email: string
  nickname: string

  @IsString()
  @Optional()
  password?: string
}
