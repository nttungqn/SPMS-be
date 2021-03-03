import { Test, TestingModule } from '@nestjs/testing';
import { LoaiKhoiKienThucService } from './loai-khoi-kien-thuc.service';

describe('TypeOfKnowledgeBlockService', () => {
  let service: LoaiKhoiKienThucService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoaiKhoiKienThucService]
    }).compile();

    service = module.get<LoaiKhoiKienThucService>(LoaiKhoiKienThucService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
