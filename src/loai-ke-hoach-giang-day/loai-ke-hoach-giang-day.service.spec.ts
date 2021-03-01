import { Test, TestingModule } from '@nestjs/testing';
import { LoaiKeHoachGiangDayService } from './loai-ke-hoach-giang-day.service';

describe('LoaiKeHoachGiangDayService', () => {
  let service: LoaiKeHoachGiangDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoaiKeHoachGiangDayService]
    }).compile();

    service = module.get<LoaiKeHoachGiangDayService>(LoaiKeHoachGiangDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
