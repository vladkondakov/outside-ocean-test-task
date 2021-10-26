import { Injectable } from "@nestjs/common"
import { v4 as uuidv4 } from "uuid"
import * as bcrypt from "bcrypt"

import { UserRepository } from "../repositories/user.repository"
import { SignInCredentialsDto } from "../dto/auth/signin-credentials.dto"
import { UserToInsert } from "src/dto/user/user-to-insert.dto"
import { UserDto } from "src/dto/user/user.dto"

@Injectable()
export class AuthService {
  constructor(private readonly _userRepository: UserRepository) {}

  async signIn(signInCredentials: SignInCredentialsDto): Promise<UserDto> {
    const { email, password, nickname } = signInCredentials
    const uid = uuidv4()

    await this._userRepository.checkIfUserExists(email, nickname)
    const hashedPassword = await this.getHashedPassword(password)
    signInCredentials.password = hashedPassword

    await this._userRepository.insertUser({ ...signInCredentials, uid })
    // login user
    return user
  }

  private async getHashedPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 12)
    return hashedPassword
  }
}
