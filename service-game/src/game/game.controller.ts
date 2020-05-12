import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Headers,
  Post,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { GameService } from './game.service';
import { generateRandomCardFromDeck } from '../common/utils';
import { GAME_COMPARE_PROPERTIES, GAME_STATUSES } from './game.constants';

@Controller('game')
export class GameController {
  constructor(
    private readonly userService: UserService,
    private readonly gameService: GameService,
  ) {}

  @Post('start')
  async startGame(
    @Headers('authorization') token: string,
    @Body('betAmount') betAmount: number,
  ) {
    if (!token) {
      throw new ForbiddenException();
    }

    const { userId } = await this.userService.authenticate(token);
    let game = await this.gameService.findGame(userId);

    if (!game) {
      game = await this.gameService.createGame(userId, betAmount);
    }
    return game;
  }

  @Post('end')
  async endGame(
    @Headers('authorization') token: string,
    @Body('compareProperty') compareProperty: string,
  ) {
    if (!token) {
      throw new ForbiddenException();
    }

    const { userId, balance } = await this.userService.authenticate(token);
    let game = await this.gameService.findGame(userId);

    if (game && game.finished) throw new BadRequestException();

    await this.userService.withdraw(token, game.betAmount);
    const nexPredictedCard = generateRandomCardFromDeck();
    let gameStatus = GAME_STATUSES.fail;

    if (
      (compareProperty === GAME_COMPARE_PROPERTIES.low &&
        game.generatedCard > nexPredictedCard) ||
      (compareProperty === GAME_COMPARE_PROPERTIES.high &&
        game.generatedCard < nexPredictedCard)
    ) {
      await this.userService.deposit(token, game.betAmount * 2);
      gameStatus = GAME_STATUSES.win;
    }

    await this.gameService.endGame(userId);

    return {
      balance,
      gameStatus,
      nexPredictedCard,
    };
  }
}
