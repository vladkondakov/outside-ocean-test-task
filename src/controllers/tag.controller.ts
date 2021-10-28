import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger"

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

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@UseInterceptors(new ResponseInterceptor<any>())
@UseGuards(AuthGuard())
@Controller("tag")
export class TagController {
  constructor(private readonly _tagService: TagService) {}

  @ApiOperation({ summary: "Get tags", description: "Get sorted and paginated tags with meta" })
  @ApiOkResponse({ description: "Sorted and paginated tags with meta" })
  @Get()
  getSortedPaginatedTags(@Query() queryParams: TagListQueryParamsDto): Promise<PaginatedResultDto<TagFullDto>> {
    return this._tagService.getSortedPaginatedTags(queryParams)
  }

  @ApiOperation({ summary: "Create tag", description: "Create tag" })
  @ApiOkResponse({ description: "Tag was created" })
  @ApiBadRequestResponse({ description: "Tag with provided name already exists" })
  @Post()
  createTag(@Body() tagToCreate: CreateTagDto, @getUser() payload: JwtPayload): Promise<TagDto> {
    return this._tagService.createTag(payload.uid, tagToCreate)
  }

  @ApiOperation({ summary: "Get tag", description: "Get tag full information" })
  @ApiOkResponse({ description: "Tag with information of the creator" })
  @ApiNotFoundResponse({ description: "Tag with that id: not found" })
  @Get("/:id")
  getTag(@Param("id", ParseIntPipe) tagId: number): Promise<TagFullDto> {
    return this._tagService.getTag(tagId)
  }

  @ApiOperation({ summary: "Update tag", description: "Update tag of the current user" })
  @ApiOkResponse({ description: "Tag was updated" })
  @ApiNotFoundResponse({ description: "Tag with that id: not found" })
  @ApiForbiddenResponse({ description: "Current user does not have access to update this tag" })
  @Put("/:id")
  updateTag(@Param("id", ParseIntPipe) tagId: number, @Body() tagToUpdate: UpdateTagDto, @getUser() payload: JwtPayload): Promise<TagFullDto> {
    return this._tagService.updateTag(payload.uid, tagId, tagToUpdate)
  }

  @ApiOperation({ summary: "Delete tag", description: "Delete tag of the current user on cascade" })
  @ApiOkResponse({ description: "Tag was deleted" })
  @ApiNotFoundResponse({ description: "Tag with that id: not found" })
  @ApiForbiddenResponse({ description: "Current user does not have access to update this tag" })
  @Delete("/:id")
  deleteTagCascade(@Param("id", ParseIntPipe) tagId: number, @getUser() payload: JwtPayload): Promise<void> {
    return this._tagService.deleteTagCascade(payload.uid, tagId)
  }
}
