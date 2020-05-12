import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { generateRandomCardFromDeck } from '../common/utils';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  betAmount: number;

  @Column({ default: false })
  finished: boolean;

  @Column()
  generatedCard: number;

  @BeforeInsert()
  setRandomGeneratedCard() {
    this.generatedCard = generateRandomCardFromDeck();
  }

  @Column()
  userId: number;
}
