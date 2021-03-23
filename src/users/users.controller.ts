import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  HttpException,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { USER_MESSAGE } from './../constant/constant';
import { FindAllUserDtoResponse } from './dto/user.response.dto';
import { FilterUser } from './dto/filter-user.dto';
import { UsersEntity } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các chi tiết kế hoạch' })
  @ApiUnauthorizedResponse({ description: USER_MESSAGE.USER_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllUserDtoResponse })
  @Get()
  findAll(@Query() filter: FilterUser) {
    return this.usersService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy chi tiết kế hoạch' })
  @ApiUnauthorizedResponse({ description: USER_MESSAGE.USERS_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: USER_MESSAGE.USER_ID_NOT_FOUND })
  @ApiOkResponse({ type: UsersEntity })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật một user' })
  @ApiUnauthorizedResponse({ description: USER_MESSAGE.USERS_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: USER_MESSAGE.UPDATE_USER_FAILED })
  @ApiOkResponse({ description: USER_MESSAGE.UPDATE_USER_SUCCESSFULLY })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    const user = req.user || {};
    await this.usersService.update(id, {
      ...updateUserDto,
      updatedAt: new Date(),
      updatedBy: user?.id
    });
    return new HttpException(USER_MESSAGE.UPDATE_USER_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một user' })
  @ApiUnauthorizedResponse({ description: USER_MESSAGE.USERS_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: USER_MESSAGE.DELETE_USER_FAILED })
  @ApiOkResponse({ description: USER_MESSAGE.DELETE_USER_SUCCESSFULLY })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.usersService.remove(id, user?.id);
    return new HttpException(USER_MESSAGE.DELETE_USER_SUCCESSFULLY, HttpStatus.OK);
  }
}
