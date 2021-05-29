import { Injectable } from '@nestjs/common';
import { RedisCacheService } from 'cache/redisCache.service';
import { ChuongTrinhDaoTaoService } from 'chuong-trinh-dao-tao/chuong-trinh-dao-tao.service';
import { CtdtService } from 'ctdt/ctdt.service';
import { SyllabusService } from 'syllabus/syllabus.service';

@Injectable()
export class AppService {
  constructor(
    private readonly syllabusService: SyllabusService,
    private readonly chuongTrinhDaoTaoService: ChuongTrinhDaoTaoService,
    private readonly nganhDaoTaoService: CtdtService,
    private readonly cacheService: RedisCacheService
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async search(query): Promise<any> {
    const { search = '' } = query;
    const searchKey = search;
    const filter = searchKey ? { searchKey, limit: 3 } : { limit: 3 };
    const syllabusPromise = this.syllabusService.search({ ...filter });
    const chuongTrinhDaoTaoPromise = this.chuongTrinhDaoTaoService.findAll({ ...filter });
    const nganhDaoTaoPromise = this.nganhDaoTaoService.findAll({ ...filter });
    const [syllabus, chuongTrinhDaoTao, nganhDaoTao] = await Promise.allSettled([
      syllabusPromise,
      chuongTrinhDaoTaoPromise,
      nganhDaoTaoPromise
    ]);
    const results = [];
    if (syllabus?.status === 'fulfilled') {
      const syllabusArr =
        syllabus?.value?.map((item) => {
          const monHoc: any = item?.monHoc;
          return { title: monHoc?.tenTiengViet || '', group: 'SYLLABUS', id: item?.id };
        }) || [];
      results.push(...syllabusArr);
    }
    if (chuongTrinhDaoTao?.status === 'fulfilled') {
      const chuongTrinhDaoTaoArr =
        chuongTrinhDaoTao?.value?.contents?.map((item) => {
          return { title: item?.ten || '', group: 'CHUONG_TRINH_DAO_TAO', id: item?.id };
        }) || [];
      results.push(...chuongTrinhDaoTaoArr);
    }
    if (nganhDaoTao?.status === 'fulfilled') {
      const nganhDaoTaoArr =
        nganhDaoTao?.value?.contents?.map((item) => {
          return { title: item?.ten || '', group: 'NGANH_DAO_TAO', id: item?.id };
        }) || [];
      results.push(...nganhDaoTaoArr);
    }
    return results;
  }

  async getKeys() {
    return await this.cacheService.keys();
  }
}
