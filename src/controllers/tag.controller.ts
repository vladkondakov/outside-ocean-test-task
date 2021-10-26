import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { getUser } from "src/decorators/get-user.decorator"
import { JwtPayload } from "src/dto/auth/jwt-payload.dto"
import { CreateTagDto } from "src/dto/tag/create-tag.dto"
import { TagService } from "src/services/tag.service"
import { UserService } from "src/services/user.service"

@UseGuards(AuthGuard())
@Controller("tag")
export class TagController {
  constructor(private readonly _tagService: TagService) {}

  @Post()
  createTag(@Body() tagToCreate: CreateTagDto, @getUser() payload: JwtPayload) {
    return this._tagService.createTag(payload.uid, tagToCreate)
  }
}
