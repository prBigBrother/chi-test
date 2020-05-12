import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/LoginUser.dto';

@Injectable()
export class UserService {
  constructor(private httpService: HttpService) {}

  getHeadersWithAuthorizationToken(token: string) {
    return token
      ? {
          Authorization: `${token}`,
        }
      : {};
  }

  private requestUserService({ url, method, data = {}, token = '' }) {
    return this.httpService
      .request({
        url,
        method,
        data,
        headers: this.getHeadersWithAuthorizationToken(token),
      })
      .toPromise()
      .then(response => response.data)
      .catch(err => {
        throw new HttpException(err.message, err.response?.status);
      });
  }

  async loginUser(loginUserDto: LoginUserDto) {
    return this.requestUserService({
      url: '/user/login',
      method: 'POST',
      data: { user: loginUserDto },
    });
  }

  async authenticate(token: string) {
    return this.requestUserService({
      url: '/user',
      method: 'GET',
      token,
    });
  }

  async withdraw(token: string, amount: number) {
    return this.requestUserService({
      url: '/user/withdraw',
      method: 'POST',
      token,
      data: {
        amount,
      },
    });
  }

  async deposit(token: string, amount: number) {
    return this.requestUserService({
      url: '/user/deposit',
      method: 'POST',
      token,
      data: {
        amount,
      },
    });
  }
}
