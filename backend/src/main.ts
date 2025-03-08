import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  console.log('🚀 ~ bootstrap ~ port:', port);

  await app.listen(port, '0.0.0.0');
}
bootstrap();
