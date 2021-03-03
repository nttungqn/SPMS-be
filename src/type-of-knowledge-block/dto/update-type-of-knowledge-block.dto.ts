import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeOfKnowledgeBlockDto } from './create-type-of-knowledge-block.dto';

export class UpdateTypeOfKnowledgeBlockDto extends PartialType(CreateTypeOfKnowledgeBlockDto) {}
