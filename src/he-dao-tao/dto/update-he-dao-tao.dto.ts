import { PartialType } from '@nestjs/mapped-types';
import { CreateHeDaoTaoDto } from './create-he-dao-tao.dto';

export class UpdateHeDaoTaoDto extends PartialType(CreateHeDaoTaoDto) {}
