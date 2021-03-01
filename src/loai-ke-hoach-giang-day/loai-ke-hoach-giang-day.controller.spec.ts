import { Test, TestingModule } from '@nestjs/testing';
import { LoaiKeHoachGiangDayController } from './loai-ke-hoach-giang-day.controller';

describe('LoaiKeHoachGiangDayController', () => {
  let controller: LoaiKeHoachGiangDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoaiKeHoachGiangDayController]
    }).compile();

    controller = module.get<LoaiKeHoachGiangDayController>(LoaiKeHoachGiangDayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
