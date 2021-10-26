import { Body, Controller, Post, ValidationPipe } from "@nestjs/common"

import { JwtPayload } from "../dto/auth/jwt-payload.dto"
import { AuthService } from "../services/auth.service"
import { SignInCredentialsDto } from "../dto/auth/signin-credentials.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post("signin")
  signIn(@Body(ValidationPipe) signInCredentials: SignInCredentialsDto): Promise<any> {
    return this._authService.signIn(signInCredentials)
  }
}
