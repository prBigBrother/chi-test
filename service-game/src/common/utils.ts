import { GAME_CARD_DECK } from '../game/game.constants';

export function generateRandomCardFromDeck(): number {
  return GAME_CARD_DECK[Math.floor(Math.random() * GAME_CARD_DECK.length)];
}
