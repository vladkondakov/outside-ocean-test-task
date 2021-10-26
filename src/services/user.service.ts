import { Injectable } from "@nestjs/common"

@Injectable()
export class UserService {
  constructor() {}

  async validateToken(token: string) {}
}
