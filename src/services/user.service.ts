import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcrypt"

import { UpdateUserDto } from "src/dto/user/update-user.dto"
import { TagRepository } from "src/repositories/tag.repository"
import { UserRepository } from "src/repositories/user.repository"

@Injectable()
export class UserService {
  constructor(private readonly _userRepository: UserRepository, private readonly _tagRepository: TagRepository) {}

  async getCurrentUser(uid: string) {
    const user = await this._userRepository.getUserByUid(uid)
    const tags = await this._tagRepository.getTagsByCreator(uid)
    return { ...user, tags }
  }

  async updateCurrentUser(uid: string, userToUpdate: UpdateUserDto) {
    await this._userRepository.checkIfUserExists(userToUpdate?.email, userToUpdate?.nickname)

    if (userToUpdate.password) {
      const hashedPassword = await bcrypt.hash(userToUpdate.password, 12)
      userToUpdate.password = hashedPassword
    }

    await this._userRepository.updateCurrentUser(uid, userToUpdate)
  }
}
