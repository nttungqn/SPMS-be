import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonHocTruocEntity } from './entity/mon-hoc-truoc.entity';

@Injectable()
export class MonHocTruocService {
  constructor(
    @InjectRepository(MonHocTruocEntity)
    private monHocTruocRepository: Repository<MonHocTruocEntity>
  ) {}
  async getMonHocThayThe(id: number, khoaMonHocTruoc: number, khoaMonHoc: number) {
    const results = await this.monHocTruocRepository
      .createQueryBuilder('mhtr')
      .leftJoinAndSelect('mhtr.monHocThayThe', 'monHocThayThe')
      .leftJoin('mhtr.ctndtMonHocTruoc', 'ctndtMonHocTruoc')
      .leftJoin('mhtr.ctndtMonHoc', 'ctndtMonHoc')
      .where((qb) => {
        qb.where('ctndtMonHocTruoc.khoa = :khoaMonHocTruoc and ctndtMonHoc.khoa <= :khoaMonHoc', {
          khoaMonHocTruoc: khoaMonHocTruoc,
          khoaMonHoc: khoaMonHoc
        });
      })
      .getMany();
    return results.map((e) => e.monHocThayThe);
  }
}
