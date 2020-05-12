import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(helmet());

  const appConfig: AppConfigService = app.get('AppConfigService');
  await app.listen(appConfig.port || 3020);
}
bootstrap();
