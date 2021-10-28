import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger"

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

  @ApiOperation({ summary: "Sign in user", description: "Sign in user" })
  @ApiOkResponse({ description: "User was added and authenticated", type: JwtTokensDto })
  @ApiBadRequestResponse({ description: "Validation failed" })
  @Post("signin")
  signIn(@Body() signInCredentials: SignInCredentialsDto): Promise<JwtTokensDto> {
    return this._authService.signIn(signInCredentials)
  }

  @ApiOperation({ summary: "Login user", description: "Login user" })
  @ApiOkResponse({ description: "User was authenticated", type: JwtTokensDto })
  @ApiBadRequestResponse({ description: "Validation failed or user does not exist" })
  @Post("login")
  login(@Body() loginCredentials: LoginCredentialsDto): Promise<JwtTokensDto> {
    return this._authService.login(loginCredentials)
  }

  @ApiOperation({ summary: "Refresh token", description: "Refresh access token" })
  @ApiOkResponse({ description: "Token was refreshed", type: JwtTokensDto })
  @ApiUnauthorizedResponse({ description: "Invalid token" })
  @Post("refresh")
  refreshTokens(@Body() jwtTokens: JwtTokensDto): Promise<JwtTokensDto> {
    return this._authService.refreshTokens(jwtTokens)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Logout user", description: "Logout user" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @UseGuards(AuthGuard())
  @Post("logout")
  logout(@getUser() jwtPayload: JwtPayload): Promise<void> {
    return this._authService.logout(jwtPayload)
  }
}
