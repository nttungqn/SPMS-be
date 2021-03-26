import { Test, TestingModule } from '@nestjs/testing';
import { HoatDongDanhGiaService } from './hoat-dong-danh-gia.service';

describe('HoatDongDanhGiaService', () => {
  let service: HoatDongDanhGiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoatDongDanhGiaService]
    }).compile();

    service = module.get<HoatDongDanhGiaService>(HoatDongDanhGiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
