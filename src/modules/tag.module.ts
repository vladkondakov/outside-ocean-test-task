import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"

import { DatabaseModule } from "./database.module"
import { TagController } from "../controllers/tag.controller"
import { TagService } from "../services/tag.service"
import { TagRepository } from "../repositories/tag.repository"
import { UserRepository } from "../repositories/user.repository"

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }), DatabaseModule],
  controllers: [TagController],
  providers: [TagService, TagRepository, UserRepository],
  exports: [TagService],
})
export class TagModule {}
