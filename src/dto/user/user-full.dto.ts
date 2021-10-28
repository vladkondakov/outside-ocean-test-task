import { ApiProperty } from "@nestjs/swagger"
import { TagDto } from "../tag/tag.dto"

export class UserFullDto {
  @ApiProperty({ example: "example@gmail.com", description: "User email", type: String })
  email: string

  @ApiProperty({ example: "nickname", description: "User nickname", type: String })
  nickname: string

  @ApiProperty({ description: "List of tags", type: TagDto, isArray: true })
  tags: TagDto[]
}
