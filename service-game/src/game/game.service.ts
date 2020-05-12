import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameEntity } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private gameRepository: Repository<GameEntity>,
  ) {}

  async findGame(userId: number): Promise<GameEntity> {
    return this.gameRepository.findOne({ userId, finished: false });
  }

  async createGame(userId, betAmount): Promise<GameEntity> {
    const game = new GameEntity();

    game.betAmount = betAmount;
    game.userId = userId;

    return this.gameRepository.save(game);
  }

  async endGame(userId: number): Promise<GameEntity> {
    const game = await this.gameRepository.findOne({ userId, finished: false });
    game.finished = true;

    return this.gameRepository.save(game);
  }
}
