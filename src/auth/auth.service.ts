import { HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload';
import { JWT_SECRET } from 'config/config';
import { AUTH_MESSAGE, EXPIREDIN, SALT } from 'constant/constant';
import { UsersService } from 'users/users.service';
import { IUser } from 'users/interfaces/users.interface';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findOne({ email });
      if (!user) {
        return { status: HttpStatus.BAD_REQUEST, data: { message: AUTH_MESSAGE.EMAIL_NOT_EXIST } };
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
      const newPassword = await this.hashPassword(newData?.password);
      const user = await this.usersService.create({
        ...newData,
        password: newPassword
      });
      const { token } = await this.createToken(user);
      const { refreshToken } = await this.createRefreshToken(user);
      return { status: HttpStatus.OK, data: { token, refreshToken } };
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
}
