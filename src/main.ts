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

  const configService = app.get(ConfigService);

  const mongoUri = configService.get<string>('MONGODB_URI');
  console.log('Connecting to MongoDB:', mongoUri);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
}
bootstrap();
