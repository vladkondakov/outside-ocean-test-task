import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { getUser } from "src/decorators/get-user.decorator"
import { JwtPayload } from "src/dto/auth/jwt-payload.dto"
import { PaginatedResultDto } from "src/dto/general/paginated-result.dto"
import { CreateTagDto } from "src/dto/tag/create-tag.dto"
import { TagFullDto } from "src/dto/tag/tag-full.dto"
import { TagListQueryParamsDto } from "src/dto/tag/tag-list-query-params.dto"
import { TagDto } from "src/dto/tag/tag.dto"
import { UpdateTagDto } from "src/dto/tag/update-tag.dto"
import { ResponseInterceptor } from "src/interceptors/api-response.interceptor"
import { TagService } from "src/services/tag.service"

@UseInterceptors(new ResponseInterceptor<any>())
@UseGuards(AuthGuard())
@Controller("tag")
export class TagController {
  constructor(private readonly _tagService: TagService) {}

  @Get()
  getSortedPaginatedTags(@Query() queryParams: TagListQueryParamsDto): Promise<PaginatedResultDto<TagFullDto>> {
    console.log(queryParams)
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
