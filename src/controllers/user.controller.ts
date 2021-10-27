import { Body, Controller, Delete, Get, Put, UseGuards, UseInterceptors } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { getUser } from "src/decorators/get-user.decorator"
import { JwtPayload } from "src/dto/auth/jwt-payload.dto"
import { UpdateUserDto } from "src/dto/user/update-user.dto"
import { ResponseInterceptor } from "src/interceptors/api-response.interceptor"
import { UserService } from "src/services/user.service"

@UseInterceptors(new ResponseInterceptor<any>())
@UseGuards(AuthGuard())
@Controller("user")
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  getUser(@getUser() payload: JwtPayload) {
    return this._userService.getCurrentUser(payload.uid)
  }

  @Put()
  updateUser(@Body() userToUpdate: UpdateUserDto, @getUser() payload: JwtPayload) {
    return this._userService.updateCurrentUser(payload.uid, userToUpdate)
  }

  @Delete()
  deleteUserCascade(@getUser() payload: JwtPayload) {
    return this._userService.deleteCurrentUserCascade(payload.uid)
  }
}
