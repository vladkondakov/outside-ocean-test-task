import { BadRequestException, Injectable } from "@nestjs/common"

import { DatabaseService } from "../services/database.service"
import { UpdateUserDto } from "../dto/user/update-user.dto"
import { UserToInsert } from "../dto/user/user-to-insert.dto"
import { UserDto } from "../dto/user/user.dto"

@Injectable()
export class UserRepository {
  constructor(private readonly _databaseService: DatabaseService) {}

  async checkIfUserExists(email: string, nickname: string): Promise<void> {
    const queryText = `SELECT * FROM public.users AS users
      WHERE users.email = '${email}' OR users.nickname = '${nickname}'
      LIMIT 1`

    const { row: user } = await this._databaseService.getQueryResult<UserDto>(queryText)

    if (user) {
      if (user.email === email) {
        throw new BadRequestException("User with provided email was found")
      }

      throw new BadRequestException("User with provided nickname was found")
    }
  }

  async insertUser(userToInsert: UserToInsert): Promise<void> {
    const { uid, email, password, nickname } = userToInsert
    const queryText = `INSERT INTO public.users(uid, email, password, nickname) VALUES('${uid}', '${email}', '${password}', '${nickname}')`

    await this._databaseService.getQueryResult<UserDto>(queryText)
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    const queryText = `SELECT uid, email, password, nickname
      FROM public.users AS users
      WHERE users.email = '${email}'`

    const { row: user } = await this._databaseService.getQueryResult<UserDto>(queryText)
    return user
  }

  async getUserByUidWithPassword(uid: string): Promise<UserDto> {
    const queryText = `SELECT email, nickname, password
      FROM public.users AS users
      WHERE users.uid = '${uid}'`

    const { row: user } = await this._databaseService.getQueryResult<UserDto>(queryText)
    return user
  }

  async getUserByUid(uid: string): Promise<UserDto> {
    const queryText = `SELECT uid, email, nickname
      FROM public.users AS users
      WHERE users.uid = '${uid}'`

    const { row: user } = await this._databaseService.getQueryResult<UserDto>(queryText)
    return user
  }

  async updateUser(uid: string, userToUpdate: UpdateUserDto): Promise<void> {
    const { email, password, nickname } = userToUpdate

    const queryText = `UPDATE users SET
        email = '${email}',
        password = '${password}',
        nickname = '${nickname}'
      WHERE uid = '${uid}'`

    await this._databaseService.getQueryResult<any>(queryText)
  }

  async deleteUser(uid: string): Promise<void> {
    const queryText = `DELETE FROM public.users AS users
      WHERE users.uid = '${uid}'`

    await this._databaseService.getQueryResult<any>(queryText)
  }
}
