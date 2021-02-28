import { Test, TestingModule } from '@nestjs/testing';
import { ChuanDauRaController } from './chuan-dau-ra.controller';

describe('ChuanDauRaController', () => {
  let controller: ChuanDauRaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChuanDauRaController]
    }).compile();

    controller = module.get<ChuanDauRaController>(ChuanDauRaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
