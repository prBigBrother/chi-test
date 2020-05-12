import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { DatabaseConfigModule } from './config/database/config.module';
import { DatabaseConfigService } from './config/database/config.service';
import { AppConfigModule } from './config/app/config.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useFactory: (databaseConfigService: DatabaseConfigService) => ({
        type: 'mysql',
        host: databaseConfigService.host,
        port: databaseConfigService.port,
        username: databaseConfigService.username,
        password: databaseConfigService.password,
        database: databaseConfigService.database,
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [DatabaseConfigService],
    }),
    AppConfigModule,
    GameModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
