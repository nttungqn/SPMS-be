import { PartialType } from '@nestjs/mapped-types';
import { CreateBloomV2Dto } from './create-bloom-v2.dto';

export class UpdateBloomV2Dto extends PartialType(CreateBloomV2Dto) {}
