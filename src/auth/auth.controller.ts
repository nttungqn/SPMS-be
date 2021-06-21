import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IdDto } from 'chuong-trinh-dao-tao/dto/Id.dto';
import { AUTH_MESSAGE, USER_MESSAGE } from 'constant/constant';
import { UsersService } from 'users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { SignUpDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import * as lodash from 'lodash';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { EmailDto } from './dto/email.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPassworDto } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}
  @Post('login')
  async login(@Req() req, @Res() res, @Body() body: LoginDto) {
    const { email = '', password = '' } = body;
    const { status, data } = await this.authService.login(email, password);
    return res.status(status).json(data);
  }
  @Post('signup')
  async signup(@Req() req, @Res() res, @Body() body: SignUpDto) {
    const { status, data } = await this.authService.signup(body);
    return res.status(status).json(data);
  }
  @Post('refreshtoken')
  async refreshToken(@Req() req, @Res() res, @Body() body: RefreshTokenDto) {
    try {
      const { id } = this.authService.checkToken(body?.refreshToken);
      const user = await this.usersService.findOne({ id });
      const { token } = await this.authService.createToken(user);
      const { refreshToken } = await this.authService.createRefreshToken(user);
      return res.json({ token, refreshToken });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'TOKEN_INVALID' });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get('profile')
  async getProfile(@Req() req, @Res() res) {
    try {
      const user = req.user || {};
      return res.json({ ...user });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async updateProfile(@Req() req, @Res() res, @Param() param: IdDto, @Body() updateData: UpdateProfileDto) {
    try {
      const user = req.user || {};
      const { id } = param;
      if (Number(user?.id) !== Number(id)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: USER_MESSAGE.USERS_NOT_AUTHORIZED, error: USER_MESSAGE.USERS_NOT_AUTHORIZED });
      }
      await this.usersService.update(Number(id), updateData);
      return res.status(HttpStatus.OK).json({ message: USER_MESSAGE.UPDATE_USER_SUCCESSFULLY });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: USER_MESSAGE.UPDATE_USER_FAILED, error: lodash.get(error, 'response', 'error') });
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id/change-password')
  async changePassword(@Req() req, @Res() res, @Param() param: IdDto, @Body() updateData: ChangePasswordDto) {
    try {
      const user = req.user || {};
      const { id } = param;
      if (Number(user?.id) !== Number(id)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: USER_MESSAGE.USERS_NOT_AUTHORIZED, error: USER_MESSAGE.USERS_NOT_AUTHORIZED });
      }
      const userProfile = await this.usersService.findOne({ id: Number(id), isDeleted: false });
      if (!userProfile) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: USER_MESSAGE.USER_ID_NOT_FOUND });
      }
      const checkPassword = await this.authService.comparePassword(updateData?.password, userProfile?.password);
      if (!checkPassword) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: USER_MESSAGE.PASSWORD_INCORRECT });
      }
      const newPassword = await this.authService.hashPassword(updateData?.newPassword);
      const userUpdated = await this.usersService.update(Number(id), {
        password: newPassword
      });
      return res.status(HttpStatus.OK).json({ message: USER_MESSAGE.UPDATE_USER_SUCCESSFULLY, user: userUpdated });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: USER_MESSAGE.UPDATE_USER_FAILED, error: lodash.get(error, 'response', 'error') });
    }
  }
  @Get('verify/:tokenEmail')
  async verifyEmailSignUp(@Req() req, @Res() res, @Param() param: VerifyEmailDto): Promise<any> {
    try {
      const email = await this.authService.checkEmailToken(param?.tokenEmail);
      if (!email) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: AUTH_MESSAGE.TOKEN_INVALID });
      }
      const result = await this.usersService.findOne({ email, tokenVerifyEmail: param?.tokenEmail, isDeleted: false });
      if (!result) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: AUTH_MESSAGE.VERIFY_ERROR });
      }
      if (result?.isActive) {
        return res.status(HttpStatus.OK).json({ message: AUTH_MESSAGE.TOKEN_VERIFIED });
      }
      await this.usersService.update(result?.id, { ...result, isActive: true });
      const { token } = await this.authService.createToken(result);
      const { refreshToken } = await this.authService.createRefreshToken(result);
      return res.json({ message: AUTH_MESSAGE.VERIFY_SUCCESSFULLY, data: { token, refreshToken, curUser: result } });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: AUTH_MESSAGE.VERIFY_FAILED });
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Query() emailDto: EmailDto): Promise<any> {
    const user = await this.usersService.findOneV2({ email: emailDto?.email, isDeleted: false });
    if (!user) {
      return new NotFoundException(AUTH_MESSAGE.ACCOUNT_NOT_FOUND);
    }
    await this.authService.handleForgotPassword(user);
    return new HttpException('OK', HttpStatus.OK);
  }

  @Get('forgot-password/:randomStr')
  async getResetPassword(@Param() param: ForgotPasswordDto): Promise<any> {
    const randomStr = param?.randomStr;

    await this.authService.handleGetResetPassword(randomStr);
    return new HttpException('OK', HttpStatus.OK);
  }

  @Post('forgot-password/:randomStr')
  async postResetPassword(
    @Req() req,
    @Res() res,
    @Param() param: ForgotPasswordDto,
    @Body() updateData: ResetPassworDto
  ): Promise<any> {
    try {
      const randomStr = param?.randomStr;
      const id = await this.authService.handleGetResetPassword(randomStr);
      const userProfile = await this.usersService.findOne({ id: Number(id), isDeleted: false });
      if (!userProfile) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: USER_MESSAGE.USER_ID_NOT_FOUND });
      }

      if (updateData.password !== updateData.passwordConfirm) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: AUTH_MESSAGE.PASSWORD_NOT_MATCH });
      }

      const newPassword = await this.authService.hashPassword(updateData?.password);
      await this.usersService.update(Number(id), { password: newPassword });
      return res.status(HttpStatus.OK).json({ message: USER_MESSAGE.UPDATE_USER_SUCCESSFULLY });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: USER_MESSAGE.UPDATE_USER_FAILED, error: lodash.get(error, 'response', 'error') });
    }
  }
}
