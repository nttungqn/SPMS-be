import { Test, TestingModule } from '@nestjs/testing';
import { HoatDongDayHocController } from './hoat-dong-day-hoc.controller';

describe('HoatDongDayHocController', () => {
  let controller: HoatDongDayHocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoatDongDayHocController]
    }).compile();

    controller = module.get<HoatDongDayHocController>(HoatDongDayHocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
