import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  Post,
} from '@nestjs/common';

import { UserService } from './user/user.service';
import { LoginUserDto } from './user/dto/LoginUser.dto';
import { GameService } from './game/game.service';
import { AppAuthenticateInterface, AppLoginInterface } from './app.interfaces';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly gameService: GameService,
  ) {}

  @Post('login')
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<AppLoginInterface> {
    return await this.userService.loginUser(loginUserDto);
  }

  @Post('authenticate')
  async authenticate(
    @Headers('authorization') token: string,
  ): Promise<AppAuthenticateInterface> {
    if (!token) {
      throw new ForbiddenException();
    }

    const { userId, balance, username } = await this.userService.authenticate(
      token,
    );

    const game = (await this.gameService.findGame(userId)) || null;

    return {
      userId,
      balance,
      username,
      game,
    };
  }
}
