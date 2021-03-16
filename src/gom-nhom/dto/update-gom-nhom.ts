import { PartialType } from '@nestjs/mapped-types';
import { CreateGomNhomDTO } from './create-gom-nhom';

export class UpdateGomNhomDTO extends PartialType(CreateGomNhomDTO) {}
