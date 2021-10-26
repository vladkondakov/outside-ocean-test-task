import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { getUser } from "src/decorators/get-user.decorator"
import { JwtPayload } from "src/dto/auth/jwt-payload.dto"
import { UpdateUserDto } from "src/dto/user/update-user.dto"
import { UserService } from "src/services/user.service"

@UseGuards(AuthGuard())
@Controller("user")
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  getCurrentUser(@getUser() payload: JwtPayload) {
    return this._userService.getCurrentUser(payload.uid)
  }

  @Put()
  updateUser(@Body() userToUpdate: UpdateUserDto, @getUser() payload: JwtPayload) {
    return this._userService.updateCurrentUser(payload.uid, userToUpdate)
  }
}
