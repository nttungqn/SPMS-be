import { Test, TestingModule } from '@nestjs/testing';
import { LoaiKhoiKienThucController } from './loai-khoi-kien-thuc.controller';
import { LoaiKhoiKienThucService } from './loai-khoi-kien-thuc.service';

describe('TypeOfKnowledgeBlockController', () => {
  let controller: LoaiKhoiKienThucController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoaiKhoiKienThucController],
      providers: [LoaiKhoiKienThucService]
    }).compile();

    controller = module.get<LoaiKhoiKienThucController>(LoaiKhoiKienThucController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
