import { Test, TestingModule } from '@nestjs/testing';
import { HoatDongDayHocService } from './hoat-dong-day-hoc.service';

describe('HoatDongDayHocService', () => {
  let service: HoatDongDayHocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoatDongDayHocService]
    }).compile();

    service = module.get<HoatDongDayHocService>(HoatDongDayHocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
