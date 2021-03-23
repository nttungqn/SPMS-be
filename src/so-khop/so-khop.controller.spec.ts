import { Test, TestingModule } from '@nestjs/testing';
import { SoKhopController } from './so-khop.controller';
import { SoKhopService } from './so-khop.service';

describe('SoKhopController', () => {
  let controller: SoKhopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoKhopController],
      providers: [SoKhopService]
    }).compile();

    controller = module.get<SoKhopController>(SoKhopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
