import { createParamDecorator } from "@nestjs/common"
import { JwtPayload } from "../dto/auth/jwt-payload.dto"

export const getUser = createParamDecorator((data, req): JwtPayload => {
  return req.args[0].user
})
