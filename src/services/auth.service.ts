import { Injectable, UnauthorizedException } from "@nestjs/common"
import { v4 as uuidv4 } from "uuid"
import * as bcrypt from "bcrypt"
import Config from "config"

import { UserRepository } from "../repositories/user.repository"
import { SignInCredentialsDto } from "../dto/auth/signin-credentials.dto"
import { UserDto } from "src/dto/user/user.dto"
import { LoginCredentialsDto } from "src/dto/auth/login-credentials.dto"
import { JwtPayload } from "src/dto/auth/jwt-payload.dto"
import { JwtTokensDto } from "src/dto/auth/jwt-tokens.dto"
import { JwtService } from "@nestjs/jwt"
import { AuthRepository } from "src/repositories/auth.repository"

const jwtConfig: any = Config.get("jwt")

@Injectable()
export class AuthService {
  private readonly secretKey: string = process.env.JWT_ACCESS_SECRET || jwtConfig.secret
  private readonly accessExpires: number = process.env.JWT_ACCESS_EXPIRES_IN || jwtConfig.expiresIn
  private readonly refreshExpires: number = process.env.JWT_REFRESH_EXPIRES_IN || jwtConfig.refreshTokenExpiresIn

  constructor(private readonly _userRepository: UserRepository, private readonly _jwtService: JwtService, private readonly _authRepository: AuthRepository) {}

  async signIn(signInCredentials: SignInCredentialsDto): Promise<JwtTokensDto> {
    const { email, password, nickname } = signInCredentials
    const uid = uuidv4()

    await this._userRepository.checkIfUserExists(email, nickname)
    const hashedPassword = await this.getHashedPassword(password)
    signInCredentials.password = hashedPassword

    await this._userRepository.insertUser({ ...signInCredentials, uid })
    const jwtTokens = await this.login({ email, password })

    return jwtTokens
  }

  async login(loginCredentials: LoginCredentialsDto): Promise<JwtTokensDto> {
    const { email, password } = loginCredentials
    const user = await this._userRepository.getUserByEmail(email)

    if (user == null || !this.comparePasswords(password, user.password)) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const payload = await this.providePayload(user)
    const jwtTokens = await this.generateJwtTokens(payload)

    return jwtTokens
  }

  private async providePayload(user: UserDto): Promise<JwtPayload> {
    const { uid, email, nickname } = user
    const payload: JwtPayload = {
      uid,
      email,
      nickname,
    }
    return payload
  }

  private async generateJwtTokens(payload: JwtPayload): Promise<JwtTokensDto> {
    await this._authRepository.deleteRefreshToken(payload.uid)

    const accessToken = await this._jwtService.signAsync(payload, { secret: this.secretKey, expiresIn: this.accessExpires, algorithm: "HS512" })
    const refreshToken = await this._jwtService.signAsync(payload, { secret: this.secretKey, expiresIn: this.refreshExpires, algorithm: "HS512" })

    await this._authRepository.saveRefreshToken(refreshToken, payload.uid)

    const jwtTokens: JwtTokensDto = {
      accessToken,
      refreshToken,
    }

    return jwtTokens
  }

  async refreshTokens(jwtTokens: JwtTokensDto): Promise<JwtTokensDto> {
    const { accessToken, refreshToken } = jwtTokens
    const existingRefreshToken = await this._authRepository.getRefreshTokenByHash(refreshToken)

    if (existingRefreshToken == null) {
      throw new UnauthorizedException("Invalid token")
    }

    try {
      const { iat, exp, ...restProps } = await this._jwtService.verifyAsync<JwtPayload>(refreshToken, { secret: this.secretKey, algorithms: ["HS512"] })
      const refreshedJwtTokens = await this.generateJwtTokens(restProps)

      return refreshedJwtTokens
    } catch (e) {
      throw new UnauthorizedException("Invalid token")
    }
  }

  /*
    Also we can create tokens block-list to check the access token. So we ask to pass access and refresh tokens in req body.
    Then verify them, after delete refresh token and add access token to the block-list
  */
  async logout(payload: JwtPayload): Promise<void> {
    await this._authRepository.deleteRefreshToken(payload.uid)
  }

  private async comparePasswords(password: any, hashedPassword: any) {
    return await bcrypt.compare(password, hashedPassword)
  }

  private async getHashedPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 12)
    return hashedPassword
  }
}
