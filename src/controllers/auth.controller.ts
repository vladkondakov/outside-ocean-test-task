import { Body, Controller, Post } from "@nestjs/common"

import { JwtPayload } from "../dto/auth/jwt-payload.dto"
import { AuthService } from "../services/auth.service"
import { SignInCredentialsDto } from "../dto/auth/signin-credentials.dto"
import { LoginCredentialsDto } from "src/dto/auth/login-credentials.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post("signin")
  signIn(@Body() signInCredentials: SignInCredentialsDto): Promise<any> {
    return this._authService.signIn(signInCredentials)
  }

  @Post("login")
  login(@Body() loginCredentials: LoginCredentialsDto) {
    return this._authService.login(loginCredentials)
  }
}
