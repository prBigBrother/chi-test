import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UserAuthInterface, UserInterface } from './user.interfaces';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/LoginUser.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body('user') loginUserDto: LoginUserDto,
    @Req() reqs,
  ): Promise<UserAuthInterface> {
    const user = await this.userService.login(loginUserDto);

    if (!user)
      throw new ForbiddenException('User not found or credentials invalid');

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findOne(@Req() req): Promise<UserInterface> {
    const { userId } = req.user;
    const user = await this.userService.findOne(userId);

    if (!user) throw new ForbiddenException('User Not Found');

    const { username, balance } = user;

    return {
      userId,
      username,
      balance,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  async withdraw(@Req() req, @Body('amount') amount: number) {
    return this.userService.withdraw(req.user.userId, amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async deposit(@Req() req, @Body('amount') amount: number) {
    return this.userService.deposit(req.user.userId, amount);
  }
}
