import { TagFullDbDto } from "src/dto/tag/tag-full-db.dto"
import { TagFullDto } from "src/dto/tag/tag-full.dto"
import { UserDto } from "src/dto/user/user.dto"

export class CustomMapper {
  static mapToTagFull(user: UserDto, name: string, sortOrder: number): TagFullDto {
    return this.formTagFull(user.nickname, user.uid, name, sortOrder)
  }

  static mapToTagFullArray(tags: TagFullDbDto[]): TagFullDto[] {
    const mappedTags = tags.map((tag) => {
      const { nickname, uid, name, sortOrder } = tag
      return this.formTagFull(nickname, uid, name, sortOrder)
    })

    return mappedTags
  }

  static formTagFull(nickname: string, uid: string, name: string, sortOrder: number): TagFullDto {
    const tagFull: TagFullDto = {
      creator: {
        nickname,
        uid,
      },
      name,
      sortOrder,
    }

    return tagFull
  }
}
