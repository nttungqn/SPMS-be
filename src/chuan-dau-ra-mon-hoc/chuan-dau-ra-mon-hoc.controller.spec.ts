import { Test, TestingModule } from '@nestjs/testing';
import { ChuanDauRaMonHocController } from './chuan-dau-ra-mon-hoc.controller';
import { ChuanDauRaMonHocService } from './chuan-dau-ra-mon-hoc.service';

describe('ChuanDauRaMonHocController', () => {
  let controller: ChuanDauRaMonHocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChuanDauRaMonHocController],
      providers: [ChuanDauRaMonHocService]
    }).compile();

    controller = module.get<ChuanDauRaMonHocController>(ChuanDauRaMonHocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
