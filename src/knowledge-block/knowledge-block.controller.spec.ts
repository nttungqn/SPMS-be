import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeBlockController } from './knowledge-block.controller';
import { KnowledgeBlockService } from './knowledge-block.service';

describe('KnowledgeBlockController', () => {
  let controller: KnowledgeBlockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnowledgeBlockController],
      providers: [KnowledgeBlockService]
    }).compile();

    controller = module.get<KnowledgeBlockController>(KnowledgeBlockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
