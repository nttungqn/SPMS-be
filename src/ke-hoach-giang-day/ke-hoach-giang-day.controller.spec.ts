import { Test, TestingModule } from '@nestjs/testing';
import { KeHoachGiangDayController } from './ke-hoach-giang-day.controller';

describe('KeHoachGiangDayController', () => {
  let controller: KeHoachGiangDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeHoachGiangDayController]
    }).compile();

    controller = module.get<KeHoachGiangDayController>(KeHoachGiangDayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
