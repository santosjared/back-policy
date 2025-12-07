import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { DenunciasSeedService } from './denuncias-seed.service';
import { KindsSeedService } from './kinds-seed.service';
import { ServicesSeedService } from './services-seed.service';
import { ZoneSeedService } from './zone-seed.service';
import { TypeSeedService } from './type-seed.service';
import { MarkerSeedService } from './marker-seed.service';
import { GradeSeedService } from './grade-seed.service';
import { PostSeedService } from './post-seed.service';
import { AdminSeedService } from './admin-seed.service';
import { TurnosSeedService } from './turnos-seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  try {
    const denunciasSeedService = app.get(DenunciasSeedService);
    const kindsSeedService = app.get(KindsSeedService);
    const servicesSeedService = app.get(ServicesSeedService);
    const zoneSeedService = app.get(ZoneSeedService);
    const typeSeedService = app.get(TypeSeedService);
    const markerSeedService = app.get(MarkerSeedService);
    const gradeSeedService = app.get(GradeSeedService);
    const postSeedService = app.get(PostSeedService);
    const adminSeedService = app.get(AdminSeedService);
    const turnoSeedService = app.get(TurnosSeedService)

    await denunciasSeedService.seed();
    await kindsSeedService.seed();
    await servicesSeedService.seed();
    await zoneSeedService.seed();
    await typeSeedService.seed();
    await markerSeedService.seed();
    await gradeSeedService.seed();
    await postSeedService.seed();
    await adminSeedService.seed();
    await turnoSeedService.seed();

    console.log('✅ Seed executed successfully.');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
