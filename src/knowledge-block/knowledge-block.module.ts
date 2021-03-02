import { Module } from '@nestjs/common';
import { KnowledgeBlockService } from './knowledge-block.service';
import { KnowledgeBlockController } from './knowledge-block.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeBlock } from './entity/knowledge-block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeBlock])],
  controllers: [KnowledgeBlockController],
  providers: [KnowledgeBlockService]
})
export class KnowledgeBlockModule {}
