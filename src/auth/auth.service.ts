import {
  CACHE_MANAGER,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload';
import { FE_ROUTE, JWT_SECRET } from 'config/config';
import { AUTH_MESSAGE, EXPIREDIN, SALT, TTL_RESET_PASSWORD } from 'constant/constant';
import { UsersService } from 'users/users.service';
import { IUser } from 'users/interfaces/users.interface';
import { UsersEntity } from 'users/entity/user.entity';
import { Cache } from 'cache-manager';
import * as cryptoRandomString from 'crypto-random-string';
import { sendMailResetPassword } from 'utils/sendMail';
import { RedisCacheService } from 'cache/redisCache.service';
import { type } from 'os';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private cacheManager: RedisCacheService) {}
  async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findOne({ email, isDeleted: false });
      if (!user) {
        return { status: HttpStatus.BAD_REQUEST, data: { message: AUTH_MESSAGE.EMAIL_NOT_EXIST } };
      }
      if (!user?.isActive) {
        return { status: HttpStatus.OK, data: { message: AUTH_MESSAGE.ACCOUNT_NOT_VERIFY } };
      }
      const checkPassword = await this.comparePassword(password, user?.password);
      if (!checkPassword) {
        return { status: HttpStatus.BAD_REQUEST, data: { message: AUTH_MESSAGE.EMAIL_OR_PASSWORD_INCORRECT } };
      }
      const { token } = await this.createToken(user);
      const { refreshToken } = await this.createRefreshToken(user);
      return { status: HttpStatus.OK, data: { token, refreshToken } };
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, data: { message: AUTH_MESSAGE.LOGIN_FAILED } };
    }
  }
  async signup(newData: IUser): Promise<any> {
    try {
      const checkExistEmail = await this.usersService.findOne({ email: newData?.email });
      if (checkExistEmail) {
        return { status: HttpStatus.CONFLICT, data: { message: AUTH_MESSAGE.EMAIL_IS_EXIST } };
      }
      const { tokenVerifyEmail } = await this.createEmailToken({ email: newData?.email });
      const newPassword = await this.hashPassword(newData?.password);
      await this.usersService.create({
        ...newData,
        password: newPassword,
        tokenVerifyEmail
      });
      return { status: HttpStatus.OK, data: { message: AUTH_MESSAGE.SIGN_UP_SUCCESSFULLY } };
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, data: { message: AUTH_MESSAGE.SIGN_UP_FAILED } };
    }
  }
  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.usersService.getProfile({ id: payload?.id, email: payload?.email });
  }
  async createToken(user: IUser): Promise<any> {
    const expiresIn = EXPIREDIN || 3600;
    const token = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        username: user?.username,
        firstName: user?.firstName,
        lastName: user?.lastName
      },
      JWT_SECRET,
      { expiresIn }
    );

    return {
      expiresIn,
      token
    };
  }
  async createRefreshToken(user: IUser): Promise<any> {
    const expiresRefresh = 864000;

    const refreshToken = jwt.sign(
      {
        id: user.id
      },
      JWT_SECRET,
      { expiresIn: expiresRefresh }
    );

    return {
      expiresRefresh,
      refreshToken
    };
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, SALT);
  }

  async comparePassword(myPassword: string, hashPassword: string) {
    return await bcrypt.compare(myPassword, hashPassword);
  }

  checkToken(refreshToken: string) {
    return jwt.verify(refreshToken.replace('Bearer ', ''), JWT_SECRET);
  }
  async createEmailToken(payload): Promise<any> {
    const expiresIn = EXPIREDIN || 864000;
    const tokenVerifyEmail = jwt.sign(
      {
        ...payload
      },
      JWT_SECRET,
      { expiresIn }
    );

    return {
      expiresIn,
      tokenVerifyEmail
    };
  }
  async checkEmailToken(token: string): Promise<any> {
    const { email = '' } = this.checkToken(token);
    return email;
  }

  async handleForgotPassword(user: UsersEntity) {
    try {
      const randomStr = cryptoRandomString({ length: 20, type: 'url-safe' });
      await this.cacheManager.setKeyForgotPassword(randomStr, user.id, TTL_RESET_PASSWORD);
      const urlResetPassword = `${FE_ROUTE}/forgot-password/${randomStr}`;
      const errorRes:any = await sendMailResetPassword(user, urlResetPassword);
      if (errorRes) {
        throw new InternalServerErrorException(errorRes);
      }
    } catch (error) {
      throw new InternalServerErrorException(AUTH_MESSAGE.SOME_THING_WENT_WRONG);
    }
  }

  async handleGetResetPassword(radomStr: string) {
    try {
      const userId = await this.cacheManager.getKeyForgotPassword(radomStr);
      if (!userId) throw new NotFoundException(AUTH_MESSAGE.ACCOUNT_NOT_FOUND);
      return userId;
    } catch (error) {
      throw new NotFoundException(AUTH_MESSAGE.LINK_NOT_FOUND);
    }
  }
}
