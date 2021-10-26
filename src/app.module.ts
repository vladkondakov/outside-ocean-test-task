import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { AuthModule } from "./modules/auth.module"
import { TagModule } from "./modules/tag.module"
import { UserModule } from "./modules/user.module"

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, TagModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
