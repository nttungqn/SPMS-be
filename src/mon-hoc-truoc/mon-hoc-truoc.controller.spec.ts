import { Test, TestingModule } from '@nestjs/testing';
import { MonHocTruocController } from './mon-hoc-truoc.controller';

describe('MonHocTruocController', () => {
  let controller: MonHocTruocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonHocTruocController]
    }).compile();

    controller = module.get<MonHocTruocController>(MonHocTruocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
