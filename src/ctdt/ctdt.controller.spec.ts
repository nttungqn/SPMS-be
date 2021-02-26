import { Test, TestingModule } from '@nestjs/testing';
import { CtdtController } from './ctdt.controller';

describe('CtdtController', () => {
  let controller: CtdtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CtdtController]
    }).compile();

    controller = module.get<CtdtController>(CtdtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
