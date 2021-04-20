import { Injectable } from '@nestjs/common';
import { ChuongTrinhDaoTaoService } from 'chuong-trinh-dao-tao/chuong-trinh-dao-tao.service';
import { CtdtService } from 'ctdt/ctdt.service';
import { MonHocService } from 'mon-hoc/mon-hoc.service';

@Injectable()
export class AppService {
  constructor(
    private readonly monHocService: MonHocService,
    private readonly chuongTrinhDaoTaoService: ChuongTrinhDaoTaoService,
    private readonly nganhDaoTaoService: CtdtService
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async search(query): Promise<any> {
    const { search = '' } = query;
    const filter = search ? { search, limit: 3 } : { limit: 3 };
    const monHocPromise = this.monHocService.findAll({ ...filter });
    const chuongTrinhDaoTaoPromise = this.chuongTrinhDaoTaoService.findAll({ ...filter });
    const nganhDaoTaoPromise = this.nganhDaoTaoService.findAll({ ...filter });
    const [monHoc, chuongTrinhDaoTao, nganhDaoTao] = await Promise.allSettled([
      monHocPromise,
      chuongTrinhDaoTaoPromise,
      nganhDaoTaoPromise
    ]);
    const results = [];
    if (monHoc?.status === 'fulfilled') {
      const monHocArr =
        monHoc?.value?.contents?.map((item) => {
          return { title: item?.tenTiengViet || '', group: 'MON_HOC' };
        }) || [];
      results.push(...monHocArr);
    }
    if (chuongTrinhDaoTao?.status === 'fulfilled') {
      const chuongTrinhDaoTaoArr =
        chuongTrinhDaoTao?.value?.contents?.map((item) => {
          return { title: item?.ten || '', group: 'CHUONG_TRINH_DAO_TAO' };
        }) || [];
      results.push(...chuongTrinhDaoTaoArr);
    }
    if (nganhDaoTao?.status === 'fulfilled') {
      const nganhDaoTaoArr =
        nganhDaoTao?.value?.contents?.map((item) => {
          return { title: item?.ten || '', group: 'NGANH_DAO_TAO' };
        }) || [];
      results.push(...nganhDaoTaoArr);
    }
    return results;
  }
}
