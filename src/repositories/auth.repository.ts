import { Injectable } from "@nestjs/common"

import { RefreshTokenDto } from "../dto/auth/refresh-token.dto"
import { DatabaseService } from "../services/database.service"

@Injectable()
export class AuthRepository {
  constructor(private readonly _databaseService: DatabaseService) {}

  async getRefreshTokenByUserUid(uid: string): Promise<RefreshTokenDto> {
    const queryText = `SELECT * FROM public.refresh_token as rt
      WHERE rt.user_uid = '${uid}'`

    const { row: refreshToken } = await this._databaseService.getQueryResult<RefreshTokenDto>(queryText)
    return refreshToken
  }

  async getRefreshTokenByHash(hash: string): Promise<RefreshTokenDto> {
    const queryText = `SELECT * FROM public.refresh_token as rt
      WHERE rt.hash = '${hash}'`

    const { row: refreshToken } = await this._databaseService.getQueryResult<RefreshTokenDto>(queryText)
    return refreshToken
  }

  async saveRefreshToken(refreshToken: string, userUid: string): Promise<void> {
    const queryText = `INSERT INTO public.refresh_token(hash, user_uid) VALUES('${refreshToken}', '${userUid}')`
    await this._databaseService.getQueryResult<RefreshTokenDto>(queryText)
  }

  async deleteRefreshToken(userUid: string): Promise<void> {
    const queryText = `DELETE FROM public.refresh_token AS rt
      WHERE rt.user_uid = '${userUid}'`
    await this._databaseService.getQueryResult<RefreshTokenDto>(queryText)
  }
}
