import { Test, TestingModule } from '@nestjs/testing';
import { LoaiDanhGiaService } from './loai-danh-gia.service';

describe('LoaiDanhGiaService', () => {
  let service: LoaiDanhGiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoaiDanhGiaService]
    }).compile();

    service = module.get<LoaiDanhGiaService>(LoaiDanhGiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
