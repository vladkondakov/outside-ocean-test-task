import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import Config from "config"

import { AppModule } from "./app.module"

async function bootstrap() {
  const server: any = process.env.PORT || Config.get("server")

  const app = await NestFactory.create(AppModule, {
    logger: ["error", "log", "warn"],
  })

  const config = new DocumentBuilder().setTitle("Test task API Documentation").setDescription("REST API backend").setVersion("1.0").addTag("auth").addBearerAuth().build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

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
