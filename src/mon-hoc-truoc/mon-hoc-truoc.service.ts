import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChiTietGomNhomService } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.service';
import { Repository } from 'typeorm';
import { CreateMonHocTruocDto } from './dto/create-mon-hoc-truoc.dto';
import { MonHocTruocEntity } from './entity/mon-hoc-truoc.entity';

@Injectable()
export class MonHocTruocService {
  constructor(
    @InjectRepository(MonHocTruocEntity)
    private monHocTruocRepository: Repository<MonHocTruocEntity>,
    private chiTietGomNhomService: ChiTietGomNhomService
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
    //return results.map((e) => e.monHocThayThe);
    return [];
  }
  async getMonHocThayTheV2(idMonHoc: number) {
    const results = await this.monHocTruocRepository
      .createQueryBuilder('mhtr')
      .leftJoinAndSelect('mhtr.ctgnMonHocTruoc', 'ctgnMonHocTruoc')
      .leftJoinAndSelect('mhtr.ctgnMonHoc', 'ctgnMonHoc')
      .where((qb) => {
        qb.leftJoinAndSelect('ctgnMonHocTruoc.monHoc', 'moHocTrc');
        qb.leftJoinAndSelect('ctgnMonHoc.monHoc', 'monHoc');
        qb.where(`ctgnMonHocTruoc.ID_MonHoc = ${idMonHoc}`);
      })
      .getMany();
    return results.map((e) => e.ctgnMonHoc.monHoc);
  }
  async create(createMonHocTruoc: CreateMonHocTruocDto) {
    const { idCTGNMonHoc, idCTGNMonHocTruoc } = createMonHocTruoc;
    const found = await this.monHocTruocRepository.findOne({
      where: {
        ctgnMonHoc: { id: idCTGNMonHoc },
        ctgnMonHocTruoc: { id: idCTGNMonHocTruoc }
      }
    });
    if (found) return;
    const monHoctruoc = new MonHocTruocEntity();
    monHoctruoc.ctgnMonHoc = await this.chiTietGomNhomService.findById(idCTGNMonHoc);
    monHoctruoc.ctgnMonHocTruoc = await this.chiTietGomNhomService.findById(idCTGNMonHocTruoc);
    try {
      const result = await this.monHocTruocRepository.save(monHoctruoc);
      console.log(result);
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
