import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger"

import { ResponseInterceptor } from "../interceptors/api-response.interceptor"
import { UserService } from "../services/user.service"
import { getUser } from "../decorators/get-user.decorator"

import { JwtPayload } from "../dto/auth/jwt-payload.dto"
import { TagsListDto } from "../dto/tag/tags-list.dto"
import { UpdateUserDto } from "../dto/user/update-user.dto"
import { UserFullDto } from "../dto/user/user-full.dto"
import { UserDto } from "../dto/user/user.dto"

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Unauthorized" })
@UseInterceptors(new ResponseInterceptor<any>())
@UseGuards(AuthGuard())
@Controller("user")
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @ApiOperation({ summary: "Get current user", description: "Get current user" })
  @ApiOkResponse({ description: "User full info", type: UserFullDto })
  @Get()
  getUser(@getUser() payload: JwtPayload): Promise<UserFullDto> {
    return this._userService.getCurrentUser(payload.uid)
  }

  @ApiOperation({ summary: "Update current user", description: "Update current user" })
  @ApiOkResponse({ description: "User was updated", type: UserDto })
  @ApiBadRequestResponse({ description: "User with provided email or nickname already exists" })
  @Put()
  updateUser(@Body() userToUpdate: UpdateUserDto, @getUser() payload: JwtPayload): Promise<UserDto> {
    return this._userService.updateCurrentUser(payload.uid, userToUpdate)
  }

  @ApiOperation({ summary: "Delete current user", description: "Delete current user on cascade" })
  @ApiOkResponse({ description: "User was deleted" })
  @Delete()
  deleteUserCascade(@getUser() payload: JwtPayload): Promise<void> {
    return this._userService.deleteCurrentUserCascade(payload.uid)
  }

  @ApiOperation({ summary: "Add tags to the current user", description: "Check and add tags to the current user" })
  @ApiOkResponse({ description: "Tags were added", type: TagsListDto })
  @Post("/tag")
  addTagsToUser(@Body("tags") tags: number[], @getUser() payload: JwtPayload): Promise<TagsListDto> {
    return this._userService.addTagsToUser(payload.uid, tags)
  }

  @ApiOperation({ summary: "Delete tag from the current user", description: "Delete tag from the current user" })
  @ApiOkResponse({ description: "Tag was deleted from the current user" })
  @Delete("/tag/:id")
  deleteTagFromUser(@Param("id", ParseIntPipe) tagId: number, @getUser() payload: JwtPayload): Promise<void> {
    return this._userService.deleteTagFromUser(payload.uid, tagId)
  }

  @ApiOperation({ summary: "Get tags of the current user", description: "Get tags of the current user" })
  @ApiOkResponse({ description: "List of tags of the current user", type: TagsListDto })
  @Get("/tag/my")
  getTagsOfCurrentUser(@getUser() payload: JwtPayload): Promise<TagsListDto> {
    return this._userService.getTagsOfCurrentUser(payload.uid)
  }
}
