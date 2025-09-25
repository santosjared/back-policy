import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { UserSeedService } from './user-seed.service';
import { DenunciasSeedService } from './denuncias-seed.service';
import { KindsSeedService } from './kinds-seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  try {
    const userSeedService = app.get(UserSeedService);
    const denunciasSeedService = app.get(DenunciasSeedService);
    const kindsSeedService = app.get(KindsSeedService);

    await userSeedService.seed();
    await denunciasSeedService.seed();
    await kindsSeedService.seed();

    console.log('✅ Seed executed successfully.');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
