import { Test, TestingModule } from '@nestjs/testing';
import { ChuDeController } from './chu-de.controller';

describe('ChuDeController', () => {
  let controller: ChuDeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChuDeController]
    }).compile();

    controller = module.get<ChuDeController>(ChuDeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
