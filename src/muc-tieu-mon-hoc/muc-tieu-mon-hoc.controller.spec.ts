import { Test, TestingModule } from '@nestjs/testing';
import { MucTieuMonHocController } from './muc-tieu-mon-hoc.controller';
import { MucTieuMonHocService } from './muc-tieu-mon-hoc.service';

describe('MucTieuMonHocController', () => {
  let controller: MucTieuMonHocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MucTieuMonHocController],
      providers: [MucTieuMonHocService]
    }).compile();

    controller = module.get<MucTieuMonHocController>(MucTieuMonHocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
