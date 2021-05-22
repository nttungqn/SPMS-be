import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ThongKeService } from './thong-ke.service';
import { GetUser } from 'auth/user.decorator';
import { UsersEntity } from 'users/entity/user.entity';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ThongKeGiaoVien } from './dto/thong-ke-giao-vien.dto';
import { IntroPageInfo } from './dto/intro-page.dto';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';
import { ThongKeSyllabusChuanDauRa } from './responses/thong-ke-syllabus-chuan-dau-ra.response';

@ApiTags('thong-ke')
@Controller('thong-ke')
export class ThongKeController {
  constructor(private readonly thongKeService: ThongKeService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Thống kê thông tin giao vien' })
  @ApiOkResponse({ description: 'OK', type: ThongKeGiaoVien })
  @Get('/giao-vien')
  thongKeGiaoVien(@GetUser() user: UsersEntity) {
    return this.thongKeService.thongKeGiaoVien(user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin trang giới thiệu' })
  @ApiOkResponse({ description: 'OK', type: IntroPageInfo })
  @Get('/intro-page')
  intro() {
    return this.thongKeService.intro();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin số lượng chuẩn đầu ra của syllabus' })
  @ApiOkResponse({ description: 'OK', type: ThongKeSyllabusChuanDauRa })
  @Get('/syllabus/:idSyllabus/chuan-dau-ra-mon-hoc')
  thongKeChuanDauRaTrongSyllabus(@Param('idSyllabus', new ParseIntPipe()) idSyllabus: number) {
    return this.thongKeService.thongKeSoLuongChuanDauRaTrongSyllabus(idSyllabus);
  }
}
