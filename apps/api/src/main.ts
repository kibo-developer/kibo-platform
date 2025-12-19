import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enables CORS for all origins (SAFE for local dev)
  await app.listen(process.env.PORT || 3001);
  console.log('Kibo API running on http://localhost:3001');
}
bootstrap();
