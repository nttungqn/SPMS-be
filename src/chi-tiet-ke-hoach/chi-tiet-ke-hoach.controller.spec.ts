import { Test, TestingModule } from '@nestjs/testing';
import { ChiTietKeHoachController } from './chi-tiet-ke-hoach.controller';

describe('ChiTietKeHoachController', () => {
  let controller: ChiTietKeHoachController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChiTietKeHoachController]
    }).compile();

    controller = module.get<ChiTietKeHoachController>(ChiTietKeHoachController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
