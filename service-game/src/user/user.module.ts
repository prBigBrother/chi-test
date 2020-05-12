import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      baseURL: process.env.WALLET_SERVICE_URL,
    }),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
