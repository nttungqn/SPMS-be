import { PartialType } from '@nestjs/mapped-types';
import { CreateKnowledgeBlockDto } from './create-knowledge-block.dto';

export class UpdateKnowledgeBlockDto extends PartialType(CreateKnowledgeBlockDto) {}
