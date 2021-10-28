import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"

import { TagRepository } from "../repositories/tag.repository"
import { UserRepository } from "../repositories/user.repository"
import { PaginatedResultDto } from "../dto/general/paginated-result.dto"
import { CreateTagDto } from "../dto/tag/create-tag.dto"
import { TagFullDto } from "../dto/tag/tag-full.dto"
import { TagListQueryParamsDto } from "../dto/tag/tag-list-query-params.dto"
import { TagDto } from "../dto/tag/tag.dto"
import { UpdateTagDto } from "../dto/tag/update-tag.dto"

import { CustomMapper } from "../helpers/mappers/custom-mapper"

@Injectable()
export class TagService {
  private readonly DEFAULT_PAGE_NUMBER: number = 1
  private readonly DEFAULT_PAGE_SIZE: number = 100

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

  async deleteTagCascade(uid: string, tagId: number): Promise<void> {
    const tag = await this._tagRepository.getTagById(tagId)

    if (tag == null) {
      throw new NotFoundException("Tag with that id: not found")
    }

    if (tag.creator !== uid) {
      throw new ForbiddenException("Current user does not have access to update this tag")
    }

    await this._tagRepository.deleteTagCascade(tagId)
  }

  async getSortedPaginatedTags(queryParams: TagListQueryParamsDto): Promise<PaginatedResultDto<TagFullDto>> {
    const { sortByName, sortByOrder, page, pageSize } = queryParams

    queryParams.sortByName = sortByName
    queryParams.sortByOrder = sortByOrder
    queryParams.page = page || this.DEFAULT_PAGE_NUMBER
    queryParams.pageSize = (pageSize && pageSize > this.DEFAULT_PAGE_SIZE) || !pageSize ? this.DEFAULT_PAGE_SIZE : pageSize

    const { items: tags, meta } = await this._tagRepository.getSortedPaginatedTags(queryParams)
    const mappedTags = CustomMapper.mapToTagFullArray(tags)

    const result: PaginatedResultDto<TagFullDto> = {
      data: mappedTags,
      meta,
    }

    return result
  }
}
