import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import Config from "config"

import { DatabaseModule } from "./database.module"
import { UserController } from "src/controllers/user.controller"
import { UserService } from "src/services/user.service"
import { UserRepository } from "src/repositories/user.repository"
import { TagRepository } from "src/repositories/tag.repository"
import { AuthService } from "src/services/auth.service"
import { AuthModule } from "./auth.module"
import { AuthRepository } from "src/repositories/auth.repository"
import { JwtModule } from "@nestjs/jwt"
import { UserTagRepository } from "src/repositories/user-tag.repository"

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }), DatabaseModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, TagRepository, UserTagRepository],
  exports: [UserService],
})
export class UserModule {}
