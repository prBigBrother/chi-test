import { UserInterface } from './user/user.interfaces';
import { GameEntity } from './game/game.entity';

export interface AppLoginInterface {
  readonly token: string;
}

export interface AppAuthenticateInterface extends UserInterface {
  readonly game: GameEntity | null;
}
