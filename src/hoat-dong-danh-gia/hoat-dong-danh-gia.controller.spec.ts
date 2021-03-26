import { Test, TestingModule } from '@nestjs/testing';
import { HoatDongDanhGiaController } from './hoat-dong-danh-gia.controller';
import { HoatDongDanhGiaService } from './hoat-dong-danh-gia.service';

describe('HoatDongDanhGiaController', () => {
  let controller: HoatDongDanhGiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoatDongDanhGiaController],
      providers: [HoatDongDanhGiaService]
    }).compile();

    controller = module.get<HoatDongDanhGiaController>(HoatDongDanhGiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
