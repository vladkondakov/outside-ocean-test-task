import { Module } from "@nestjs/common"
import { JwtModule, JwtService } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import Config from "config"

import { DatabaseModule } from "./database.module"
import { AuthController } from "../controllers/auth.controller"
import { AuthService } from "../services/auth.service"
import { JwtStrategy } from "../providers/jwt.strategy"
import { UserRepository } from "../repositories/user.repository"
import { AuthRepository } from "../repositories/auth.repository"

const jwtConfig: any = Config.get("jwt")

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || jwtConfig.expiresIn,
        algorithm: "HS512",
      },
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, UserRepository, AuthRepository],
  exports: [JwtStrategy, PassportModule, JwtModule, AuthService, AuthRepository],
})
export class AuthModule {}
