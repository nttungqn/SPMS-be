import { Test, TestingModule } from '@nestjs/testing';
import { GomNhomController } from './gom-nhom.controller';

describe('GomNhomController', () => {
  let controller: GomNhomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GomNhomController]
    }).compile();

    controller = module.get<GomNhomController>(GomNhomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
