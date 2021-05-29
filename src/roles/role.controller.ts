import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_MESSAGE } from './../constant/constant';
import { FindAllRolesDtoResponse } from './dto/roles.dto.response';
import { RolesEntity } from './entity/roles.entity';
import { CreateRolesDto } from './dto/create-roles.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { RolesGuard } from 'guards/roles.guard';
import { FilterRoles } from './dto/filter-roles.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách roles' })
  @ApiUnauthorizedResponse({ description: ROLES_MESSAGE.ROLES_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllRolesDtoResponse })
  @Get()
  findAll(@Query() filter: FilterRoles) {
    return this.rolesService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy chi tiết kế hoạch' })
  @ApiUnauthorizedResponse({ description: ROLES_MESSAGE.ROLES_NOT_AUTHORIZED })
  @ApiOkResponse({ type: RolesEntity })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Thêm một roles' })
  @ApiUnauthorizedResponse({ description: ROLES_MESSAGE.ROLES_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: ROLES_MESSAGE.CREATE_ROLES_FAILED })
  @ApiOkResponse({ type: CreateRolesDto })
  @Post()
  async create(@Body() createRolesDto: CreateRolesDto) {
    return await this.rolesService.create({ ...createRolesDto });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật một chi tiết kế hoạch roles' })
  @ApiUnauthorizedResponse({ description: ROLES_MESSAGE.ROLES_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: ROLES_MESSAGE.UPDATE_ROLES_FAILED })
  @ApiOkResponse({ description: ROLES_MESSAGE.UPDATE_ROLES_SUCCESSFULLY })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRolesDto: UpdateRolesDto, @Req() req) {
    await this.rolesService.update(id, {
      ...updateRolesDto
    });
    return new HttpException(ROLES_MESSAGE.UPDATE_ROLES_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một roles' })
  @ApiUnauthorizedResponse({ description: ROLES_MESSAGE.ROLES_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: ROLES_MESSAGE.DELETE_ROLES_FAILED })
  @ApiOkResponse({ description: ROLES_MESSAGE.DELETE_ROLES_SUCCESSFULLY })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.rolesService.remove(id);
    return new HttpException(ROLES_MESSAGE.DELETE_ROLES_SUCCESSFULLY, HttpStatus.OK);
  }
}
