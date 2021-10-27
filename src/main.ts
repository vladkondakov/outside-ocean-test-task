import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import Config from "config"

import { AppModule } from "./app.module"

async function bootstrap() {
  const server: any = process.env.PORT || Config.get("server")

  const app = await NestFactory.create(AppModule, {
    logger: ["error", "log", "warn"],
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  app.setGlobalPrefix("api")
  app.enableCors()

  await app.listen(server.port)
}
bootstrap()
