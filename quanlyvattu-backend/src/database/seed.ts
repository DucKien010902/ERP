import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  process.env.AUTO_SEED = 'false';
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'error', 'warn'] });
  const seedService = app.get(SeedService);
  const result = await seedService.run();
  console.log(result);
  await app.close();
}

bootstrap();
