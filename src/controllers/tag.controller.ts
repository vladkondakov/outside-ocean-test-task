import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { getUser } from "src/decorators/get-user.decorator"
import { JwtPayload } from "src/dto/auth/jwt-payload.dto"
import { CreateTagDto } from "src/dto/tag/create-tag.dto"
import { TagFullDto } from "src/dto/tag/tag-full.dto"
import { TagDto } from "src/dto/tag/tag.dto"
import { UpdateTagDto } from "src/dto/tag/update-tag.dto"
import { ResponseInterceptor } from "src/interceptors/api-response.interceptor"
import { TagService } from "src/services/tag.service"

@UseInterceptors(new ResponseInterceptor<any>())
@UseGuards(AuthGuard())
@Controller("tag")
export class TagController {
  constructor(private readonly _tagService: TagService) {}

  @Post()
  createTag(@Body() tagToCreate: CreateTagDto, @getUser() payload: JwtPayload): Promise<TagDto> {
    return this._tagService.createTag(payload.uid, tagToCreate)
  }

  @Get("/:id")
  getTag(@Param("id", ParseIntPipe) tagId: number): Promise<TagFullDto> {
    return this._tagService.getTag(tagId)
  }

  @Put("/:id")
  updateTag(@Param("id", ParseIntPipe) tagId: number, @Body() tagToUpdate: UpdateTagDto, @getUser() payload: JwtPayload): Promise<TagFullDto> {
    return this._tagService.updateTag(payload.uid, tagId, tagToUpdate)
  }
}
