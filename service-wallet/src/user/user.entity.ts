import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { USER_DEFAULT_BALANCE } from './user.constants';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: USER_DEFAULT_BALANCE })
  balance: number;
}
