import { Test, TestingModule } from '@nestjs/testing';
import { LoaiDanhGiaController } from './loai-danh-gia.controller';
import { LoaiDanhGiaService } from './loai-danh-gia.service';

describe('LoaiDanhGiaController', () => {
  let controller: LoaiDanhGiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoaiDanhGiaController],
      providers: [LoaiDanhGiaService]
    }).compile();

    controller = module.get<LoaiDanhGiaController>(LoaiDanhGiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
