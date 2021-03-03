import { Test, TestingModule } from '@nestjs/testing';
import { KhoiKienThucController } from './khoi-kien-thuc.controller';
import { KhoiKienThucService } from './khoi-kien-thuc.service';

describe('KnowledgeBlockController', () => {
  let controller: KhoiKienThucController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KhoiKienThucController],
      providers: [KhoiKienThucService]
    }).compile();

    controller = module.get<KhoiKienThucController>(KhoiKienThucController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
