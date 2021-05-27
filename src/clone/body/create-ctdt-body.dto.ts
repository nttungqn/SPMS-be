import { ApiProperty } from '@nestjs/swagger';
import { ChuanDauRaNganhDaoTaoEntity } from 'chuan-dau-ra-nganh-dao-tao/entity/chuanDauRaNganhDaoTao.entity';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { KeHoachGiangDayEntity } from 'ke-hoach-giang-day/entity/keHoachGiangDay.entity';
import { KhoiKienThucEntity } from 'khoi-kien-thuc/entity/khoi-kien-thuc.entity';

export class CreateCTDTBody {
  @ApiProperty()
  @IsNotEmpty()
  chuanDauRa: ChuanDauRaNganhDaoTaoEntity[];
  @ApiProperty()
  @IsNotEmpty()
  khoiKienThuc: KhoiKienThucEntity[];
  @ApiProperty()
  @IsNotEmpty()
  keHoachGiangDay: KeHoachGiangDayEntity[];
}
