import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"

import { DatabaseModule } from "./database.module"
import { TagController } from "src/controllers/tag.controller"
import { TagService } from "src/services/tag.service"
import { TagRepository } from "src/repositories/tag.repository"

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }), DatabaseModule],
  controllers: [TagController],
  providers: [TagService, TagRepository],
  exports: [TagService],
})
export class TagModule {}
