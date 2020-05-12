import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AppConfigModule } from './config/app/config.module';
import { DatabaseConfigModule } from './config/database/config.module';
import { DatabaseConfigService } from './config/database/config.service';

@Module({
  imports: [
    AppConfigModule,
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
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
