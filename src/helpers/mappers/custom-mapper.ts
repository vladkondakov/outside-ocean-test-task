import { TagFullDto } from "src/dto/tag/tag-full.dto"
import { UserDto } from "src/dto/user/user.dto"

export class CustomMapper {
  static mapToTagFull(user: UserDto, name: string, sortOrder: number): TagFullDto {
    const tagFull: TagFullDto = {
      creator: {
        nickname: user.nickname,
        uid: user.uid,
      },
      name,
      sortOrder,
    }

    return tagFull
  }
}
