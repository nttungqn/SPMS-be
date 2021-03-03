import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfKnowledgeBlockController } from './type-of-knowledge-block.controller';
import { TypeOfKnowledgeBlockService } from './type-of-knowledge-block.service';

describe('TypeOfKnowledgeBlockController', () => {
  let controller: TypeOfKnowledgeBlockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeOfKnowledgeBlockController],
      providers: [TypeOfKnowledgeBlockService]
    }).compile();

    controller = module.get<TypeOfKnowledgeBlockController>(TypeOfKnowledgeBlockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
