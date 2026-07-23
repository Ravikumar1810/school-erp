import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix("api");

  const frontendUrl = configService.get<string>("FRONTEND_URL");

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      transform: true,

      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT ?? 3001);

  console.log(
    ` Server running on http://localhost:${process.env.PORT ?? 3001}`
  );
}

bootstrap();