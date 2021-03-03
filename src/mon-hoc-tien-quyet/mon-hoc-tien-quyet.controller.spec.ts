import { Test, TestingModule } from '@nestjs/testing';
import { MonHocTienQuyetController } from './mon-hoc-tien-quyet.controller';
import { MonHocTienQuyetService } from './mon-hoc-tien-quyet.service';

describe('MonHocTienQuyetController', () => {
  let controller: MonHocTienQuyetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonHocTienQuyetController],
      providers: [MonHocTienQuyetService]
    }).compile();

    controller = module.get<MonHocTienQuyetController>(MonHocTienQuyetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
