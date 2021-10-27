import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

import { ResponseInterceptor } from "../interceptors/api-response.interceptor"
import { getUser } from "../decorators/get-user.decorator"
import { AuthService } from "../services/auth.service"

import { JwtPayload } from "../dto/auth/jwt-payload.dto"
import { SignInCredentialsDto } from "../dto/auth/signin-credentials.dto"
import { LoginCredentialsDto } from "../dto/auth/login-credentials.dto"
import { JwtTokensDto } from "../dto/auth/jwt-tokens.dto"

@UseInterceptors(new ResponseInterceptor<any>())
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
