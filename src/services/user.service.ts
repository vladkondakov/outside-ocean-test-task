import { Injectable } from "@nestjs/common"

import { AuthService } from "./auth.service"
import { TagRepository } from "../repositories/tag.repository"
import { UserTagRepository } from "../repositories/user-tag.repository"
import { UserRepository } from "../repositories/user.repository"
import { TagsListDto } from "../dto/tag/tags-list.dto"
import { UpdateUserDto } from "../dto/user/update-user.dto"
import { UserFullDto } from "../dto/user/user-full.dto"
import { UserDto } from "../dto/user/user.dto"

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _tagRepository: TagRepository,
    private readonly _authService: AuthService,
    private readonly _userTagRepository: UserTagRepository
  ) {}

  async getCurrentUser(uid: string): Promise<UserFullDto> {
    const user = await this._userRepository.getUserByUid(uid)
    const tags = await this._tagRepository.getTagsByCreator(uid)
    const userFull: UserFullDto = {
      email: user.email,
      nickname: user.nickname,
      tags,
    }

    return userFull
  }

  // refactor: remove checkIfUserExists method
  async updateCurrentUser(uid: string, userToUpdate: UpdateUserDto) {
    await this._userRepository.checkIfUserExists(userToUpdate.email, userToUpdate.nickname)

    const user = await this._userRepository.getUserByUidWithPassword(uid)

    const email = userToUpdate?.email || user.email
    const nickname = userToUpdate?.nickname || user.nickname
    const password = userToUpdate?.password ? await this._authService.getHashedPassword(userToUpdate.password) : user.password

    userToUpdate.email = email
    userToUpdate.nickname = nickname
    userToUpdate.password = password

    await this._userRepository.updateUser(uid, userToUpdate)
    const result: UserDto = { email, nickname }

    return result
  }

  async deleteCurrentUserCascade(uid: string) {
    await this._userRepository.deleteUser(uid)
  }

  async addTagsToUser(uid: string, tags: number[]): Promise<TagsListDto> {
    const tagsList = await this._tagRepository.getTags()
    const shouldAdd = tags.every((tagId) => tagsList.some((tag) => tag.id === tagId))
    const result: TagsListDto = {
      tags: [],
    }

    if (!shouldAdd) {
      return result
    }

    const addedTags = await this._userTagRepository.addTagsToUser(uid, tags)
    result.tags = addedTags

    return result
  }

  async deleteTagFromUser(uid: string, tagId: number): Promise<void> {
    await this._userTagRepository.deleteTagFromUser(uid, tagId)
  }

  async getTagsOfCurrentUser(uid: string): Promise<TagsListDto> {
    const tags = await this._userTagRepository.getTagsOfCurrentUser(uid)
    const result: TagsListDto = { tags }
    return result
  }
}
