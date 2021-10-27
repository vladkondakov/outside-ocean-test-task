import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"

import { DatabaseModule } from "./database.module"
import { AuthModule } from "./auth.module"
import { UserController } from "../controllers/user.controller"
import { UserService } from "../services/user.service"
import { UserRepository } from "../repositories/user.repository"
import { TagRepository } from "../repositories/tag.repository"
import { UserTagRepository } from "../repositories/user-tag.repository"

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }), DatabaseModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, TagRepository, UserTagRepository],
  exports: [UserService],
})
export class UserModule {}
