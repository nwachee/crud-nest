import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.get(ConfigService).get<string>('MONGODB_URI');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  await app.getUrl();
  // console.log(`Application is running on: ${url}`);
}
bootstrap();
