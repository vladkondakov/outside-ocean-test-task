import { Body, Controller, Post, UseGuards } from "@nestjs/common"

import { JwtPayload } from "../dto/auth/jwt-payload.dto"
import { AuthService } from "../services/auth.service"
import { SignInCredentialsDto } from "../dto/auth/signin-credentials.dto"
import { LoginCredentialsDto } from "src/dto/auth/login-credentials.dto"
import { JwtTokensDto } from "src/dto/auth/jwt-tokens.dto"
import { AuthGuard } from "@nestjs/passport"
import { getUser } from "src/decorators/get-user.decorator"

@Controller("auth")
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post("signin")
  signIn(@Body() signInCredentials: SignInCredentialsDto): Promise<JwtTokensDto> {
    return this._authService.signIn(signInCredentials)
  }

  @Post("login")
  login(@Body() loginCredentials: LoginCredentialsDto): Promise<JwtTokensDto> {
    return this._authService.login(loginCredentials)
  }

  @Post("refresh")
  refreshTokens(@Body() jwtTokens: JwtTokensDto): Promise<JwtTokensDto> {
    return this._authService.refreshTokens(jwtTokens)
  }

  @UseGuards(AuthGuard())
  @Post("logout")
  logout(@getUser() jwtPayload: JwtPayload): Promise<void> {
    return this._authService.logout(jwtPayload)
  }
}
