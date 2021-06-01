import { ApiProperty } from '@nestjs/swagger';
import { CreateChuDeDto } from 'chu-de/dto/create-chu-de';
import { ChuanDauRaMonHocEntity } from 'chuan-dau-ra-mon-hoc/entity/chuan-dau-ra-mon-hoc.entity';
import { IsOptional } from 'class-validator';
import { CreateHoatDongDanhGiaDto } from 'hoat-dong-danh-gia/dto/create-hoat-dong-danh-gia.dto';
import { CreateLoaiDanhGiaDto } from 'loai-danh-gia/dto/create-loai-danh-gia.dto';
import { LoaiDanhGiaEntity } from 'loai-danh-gia/entity/loai-danh-gia.entity';
import { MucTieuMonHocEntity } from 'muc-tieu-mon-hoc/entity/muc-tieu-mon-hoc.entity';
import { Entity } from 'typeorm';
import { ChuanDauRaMonHocCustom } from './chuan-dau-ra-mon-hoc.dto';
import { HoatDongDanhGiaCustom } from './hoat-dong-danh-gia.dto';
import { HoatDongDayHocCustom } from './hoat-dong-day-hoc.dto';
import { LoaiDanhGiaCustom } from './loai-danh-gia-dto';
import { MucTieuMonHocCustom } from './muc-tieu-mon-hoc.dto';

@Entity()
export class SyllabusDto {
  @ApiProperty({ description: 'resource_resource' })
  @IsOptional()
  resource_resource?: string;

  @ApiProperty({ description: 'rule_rule' })
  @IsOptional()
  rule_rule?: string;

  @ApiProperty({ description: 'description_subjectDescription' })
  @IsOptional()
  description_subjectDescription?: string;

  @ApiProperty({ description: 'goal_subjectGoals' })
  @IsOptional()
  goal_subjectGoals?: Array<MucTieuMonHocCustom>;

  @ApiProperty({ description: 'outputStandard_subjectOutputStandards' })
  @IsOptional()
  outputStandard_subjectOutputStandards?: Array<ChuanDauRaMonHocCustom>;

  @ApiProperty({ description: 'evaluation_evaluationTypes' })
  @IsOptional()
  evaluation_evaluationTypes?: Array<LoaiDanhGiaCustom>;

  @ApiProperty({ description: 'evaluation_evaluationActivities' })
  @IsOptional()
  evaluation_evaluationActivities?: Array<HoatDongDanhGiaCustom>;

  @ApiProperty({ description: 'theoreticalTeachingPlan_topics' })
  @IsOptional()
  theoreticalTeachingPlan_topics?: Array<CreateChuDeDto>;

  @ApiProperty({ description: 'practiceTeachingPlan_topics' })
  @IsOptional()
  practiceTeachingPlan_topics?: Array<CreateChuDeDto>;

  @ApiProperty({ description: 'teachingActivity_teachingActivities' })
  @IsOptional()
  teachingActivity_teachingActivities?: Array<HoatDongDayHocCustom>;
}
