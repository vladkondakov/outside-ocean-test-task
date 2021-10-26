import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import Config from "config"

import { JwtStrategy } from "../providers/jwt.strategy"
import { AuthController } from "../controllers/auth.controller"
import { AuthService } from "../services/auth.service"
import { DatabaseModule } from "./database.module"
import { UserRepository } from "src/repositories/user.repository"

const jwtConfig: any = Config.get("jwt")

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: process.env.JWT_SECRET || jwtConfig.expiresIn,
        algorithm: "HS512",
      },
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, UserRepository],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
