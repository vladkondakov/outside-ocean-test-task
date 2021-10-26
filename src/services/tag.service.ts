import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { CreateTagDto } from "src/dto/tag/create-tag.dto"
import { TagFullDto } from "src/dto/tag/tag-full.dto"
import { TagDto } from "src/dto/tag/tag.dto"
import { UpdateTagDto } from "src/dto/tag/update-tag.dto"
import { CustomMapper } from "src/helpers/mappers/custom-mapper"
import { TagRepository } from "src/repositories/tag.repository"
import { UserRepository } from "src/repositories/user.repository"

@Injectable()
export class TagService {
  constructor(private readonly _tagRepository: TagRepository, private readonly _userRepository: UserRepository) {}

  async createTag(uid: string, tagToCreate: CreateTagDto): Promise<TagDto> {
    const { name } = tagToCreate

    const existingTag = await this._tagRepository.getTagByName(name)
    if (existingTag) {
      throw new BadRequestException("Tag with provided name already exists")
    }

    await this._tagRepository.createTag(uid, tagToCreate)

    const tag = await this._tagRepository.getTagByName(name)
    return tag
  }

  async getTag(tagId: number): Promise<TagFullDto> {
    const tag = await this._tagRepository.getTagById(tagId)
    if (tag == null) {
      throw new NotFoundException("Tag with that id: not found")
    }

    const { creator: uid, name, sortOrder } = tag
    const creator = await this._userRepository.getUserByUid(uid)
    const tagFull: TagFullDto = CustomMapper.mapToTagFull(creator, name, sortOrder)

    return tagFull
  }

  async updateTag(uid: string, tagId: number, tagToUpdate: UpdateTagDto): Promise<TagFullDto> {
    if (tagToUpdate?.name) {
      const tagByName = await this._tagRepository.getTagByName(tagToUpdate.name)
      if (tagByName) {
        throw new BadRequestException("Tag with provided name already exists")
      }
    }

    const tag = await this._tagRepository.getTagById(tagId)
    if (tag == null) {
      throw new NotFoundException("Tag with that id: not found")
    }

    if (tag.creator !== uid) {
      throw new ForbiddenException("Current user does not have access to update this tag")
    }

    const name = tagToUpdate?.name || tag.name
    const sortOrder = tagToUpdate?.sortOrder || tag.sortOrder

    tagToUpdate.name = name
    tagToUpdate.sortOrder = sortOrder

    await this._tagRepository.updateTag(tagId, tagToUpdate)

    const user = await this._userRepository.getUserByUid(uid)
    const tagFull = CustomMapper.mapToTagFull(user, name, sortOrder)

    return tagFull
  }
}
