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

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }), DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, TagRepository],
  exports: [UserService],
})
export class UserModule {}