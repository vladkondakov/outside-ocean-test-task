import { TagDto } from "../tag/tag.dto"

export class UserFullDto {
  email: string
  nickname: string
  tags: TagDto[]
}
