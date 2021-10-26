import { Module } from "@nestjs/common"
import { JwtModule, JwtService } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import Config from "config"

import { JwtStrategy } from "../providers/jwt.strategy"
import { AuthController } from "../controllers/auth.controller"
import { AuthService } from "../services/auth.service"
import { DatabaseModule } from "./database.module"
import { UserRepository } from "src/repositories/user.repository"
import { AuthRepository } from "src/repositories/auth.repository"

const jwtConfig: any = Config.get("jwt")

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES || jwtConfig.expiresIn,
        algorithm: "HS512",
      },
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, UserRepository, AuthRepository],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
