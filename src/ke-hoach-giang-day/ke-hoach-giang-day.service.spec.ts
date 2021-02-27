import { Test, TestingModule } from '@nestjs/testing';
import { KeHoachGiangDayService } from './ke-hoach-giang-day.service';

describe('KeHoachGiangDayService', () => {
  let service: KeHoachGiangDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeHoachGiangDayService]
    }).compile();

    service = module.get<KeHoachGiangDayService>(KeHoachGiangDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
