import { Test, TestingModule } from '@nestjs/testing';
import { ChiTietGomNhomController } from './chi-tiet-gom-nhom.controller';

describe('ChiTietGomNhomController', () => {
  let controller: ChiTietGomNhomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChiTietGomNhomController]
    }).compile();

    controller = module.get<ChiTietGomNhomController>(ChiTietGomNhomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
