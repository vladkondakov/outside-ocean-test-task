import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

import { ResponseInterceptor } from "../interceptors/api-response.interceptor"
import { getUser } from "../decorators/get-user.decorator"
import { TagService } from "../services/tag.service"

import { JwtPayload } from "../dto/auth/jwt-payload.dto"
import { PaginatedResultDto } from "../dto/general/paginated-result.dto"
import { CreateTagDto } from "../dto/tag/create-tag.dto"
import { TagFullDto } from "../dto/tag/tag-full.dto"
import { TagListQueryParamsDto } from "../dto/tag/tag-list-query-params.dto"
import { TagDto } from "../dto/tag/tag.dto"
import { UpdateTagDto } from "../dto/tag/update-tag.dto"

@UseInterceptors(new ResponseInterceptor<any>())
@UseGuards(AuthGuard())
@Controller("tag")
export class TagController {
  constructor(private readonly _tagService: TagService) {}

  @Get()
  getSortedPaginatedTags(@Query() queryParams: TagListQueryParamsDto): Promise<PaginatedResultDto<TagFullDto>> {
    return this._tagService.getSortedPaginatedTags(queryParams)
  }

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

  @Delete("/:id")
  deleteTagCascade(@Param("id", ParseIntPipe) tagId: number, @getUser() payload: JwtPayload): Promise<void> {
    return this._tagService.deleteTagCascade(payload.uid, tagId)
  }
}
