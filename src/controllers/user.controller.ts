import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { getUser } from "src/decorators/get-user.decorator"
import { JwtPayload } from "src/dto/auth/jwt-payload.dto"
import { TagsListDto } from "src/dto/tag/tags-list.dto"
import { TagDto } from "src/dto/tag/tag.dto"
import { UpdateUserDto } from "src/dto/user/update-user.dto"
import { UserFullDto } from "src/dto/user/user-full.dto"
import { UserDto } from "src/dto/user/user.dto"
import { ResponseInterceptor } from "src/interceptors/api-response.interceptor"
import { UserService } from "src/services/user.service"

@UseInterceptors(new ResponseInterceptor<any>())
@UseGuards(AuthGuard())
@Controller("user")
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  getUser(@getUser() payload: JwtPayload): Promise<UserFullDto> {
    return this._userService.getCurrentUser(payload.uid)
  }

  @Put()
  updateUser(@Body() userToUpdate: UpdateUserDto, @getUser() payload: JwtPayload): Promise<UserDto> {
    return this._userService.updateCurrentUser(payload.uid, userToUpdate)
  }

  @Delete()
  deleteUserCascade(@getUser() payload: JwtPayload): Promise<void> {
    return this._userService.deleteCurrentUserCascade(payload.uid)
  }

  @Post("/tag")
  addTagsToUser(@Body("tags") tags: number[], @getUser() payload: JwtPayload): Promise<TagsListDto> {
    return this._userService.addTagsToUser(payload.uid, tags)
  }

  @Delete("/tag/:id")
  deleteTagFromUser(@Param("id", ParseIntPipe) tagId: number, @getUser() payload: JwtPayload): Promise<void> {
    return this._userService.deleteTagFromUser(payload.uid, tagId)
  }

  @Get("/tag/my")
  getTagsOfCurrentUser(@getUser() payload: JwtPayload): Promise<TagsListDto> {
    return this._userService.getTagsOfCurrentUser(payload.uid)
  }
}
