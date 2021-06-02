import { PartialType } from '@nestjs/mapped-types';
import { CreateBloomDto } from './create-bloom.dto';

export class UpdateBloomDto extends PartialType(CreateBloomDto) {}
