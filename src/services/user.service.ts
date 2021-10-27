import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"

import { UpdateUserDto } from "src/dto/user/update-user.dto"
import { UserFullDto } from "src/dto/user/user-full.dto"
import { UserDto } from "src/dto/user/user.dto"
import { AuthRepository } from "src/repositories/auth.repository"
import { TagRepository } from "src/repositories/tag.repository"
import { UserRepository } from "src/repositories/user.repository"
import { AuthService } from "./auth.service"

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _tagRepository: TagRepository,
    private readonly _authRepository: AuthRepository,
    private readonly _authService: AuthService
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
}
