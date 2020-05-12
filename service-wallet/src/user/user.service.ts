import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from './user.entity';
import { LoginUserDto } from './dto/LoginUser.dto';
import { UserAuthInterface } from './user.interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async login({
    username,
    password,
  }: LoginUserDto): Promise<UserAuthInterface> {
    const user = await this.userRepository.findOne({ username });

    if (user && password === user.password) {
      const { id } = user;
      const token = this.jwtService.sign({ username, id });

      return {
        token,
      };
    }

    return null;
  }

  async withdraw(userId: string, amount: number) {
    const user = await this.userRepository.findOne(userId);
    delete user.password;

    if (user.balance - amount < 0)
      throw new BadRequestException("Balance can't be less then zero");

    user.balance = user.balance - amount;

    return this.userRepository.save(user);
  }

  async deposit(userId: string, amount: number) {
    const user = await this.userRepository.findOne(userId);
    delete user.password;

    user.balance = user.balance + amount;

    return this.userRepository.save(user);
  }
}
