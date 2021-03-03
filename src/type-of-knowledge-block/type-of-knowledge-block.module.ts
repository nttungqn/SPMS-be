import { Module } from '@nestjs/common';
import { TypeOfKnowledgeBlockService } from './type-of-knowledge-block.service';
import { TypeOfKnowledgeBlockController } from './type-of-knowledge-block.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOfKnowledgeBlock } from './entity/type-of-knowledge-block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOfKnowledgeBlock])],
  controllers: [TypeOfKnowledgeBlockController],
  providers: [TypeOfKnowledgeBlockService]
})
export class TypeOfKnowledgeBlockModule {}
