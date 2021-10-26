import { BadRequestException, Injectable } from "@nestjs/common"
import { CreateTagDto } from "src/dto/tag/create-tag.dto"
import { TagRepository } from "src/repositories/tag.repository"
import { UserRepository } from "src/repositories/user.repository"

@Injectable()
export class TagService {
  constructor(private readonly _tagRepository: TagRepository) {}

  async createTag(uid: string, tagToCreate: CreateTagDto) {
    const { name } = tagToCreate

    const existingTag = await this._tagRepository.getTagByName(name)
    if (existingTag) {
      throw new BadRequestException("Tag with provided name already exists")
    }

    await this._tagRepository.createTag(uid, tagToCreate)

    const tag = await this._tagRepository.getTagByName(name)
    return tag
  }
}
