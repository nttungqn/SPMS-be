import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChiTietGomNhomService } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.service';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { MonHocService } from 'mon-hoc/mon-hoc.service';
import { FilterSoKhopNganhDaoTao } from './dto/filter-so-khop.dto';
import { RowSoKhopNganhDaoTao } from './dto/row-so-khop.dto';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';
import { REDIS_CACHE_VARS, SOKHOP_MESSAGE } from 'constant/constant';
import { UsersEntity } from 'users/entity/user.entity';
import { UpdateSoKhopRequestBody } from './body/update-so-kho-request-body';
import { Connection, getConnection } from 'typeorm';

@Injectable()
export class SoKhopService {
  constructor(
    private chiTietGomNhomService: ChiTietGomNhomService,
    private monHocService: MonHocService,
    private cacheManager: RedisCacheService
  ) {}

  async soKhopNganhDaoTao(idNganhDaoTao: number, filter: FilterSoKhopNganhDaoTao) {
    const key = format(REDIS_CACHE_VARS.LIST_CHI_TIET_GOM_NHOM_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const { khoaTuyenNam1, khoaTuyenNam2 } = filter;

      const firstSubjects: MonHocEntity[] = await this.monHocService.getAllSubjectByNganhDaoTaoAndKhoaTuyen(
        idNganhDaoTao,
        Number(khoaTuyenNam1)
      );
      const secondSubjects: MonHocEntity[] = await this.monHocService.getAllSubjectByNganhDaoTaoAndKhoaTuyen(
        idNganhDaoTao,
        Number(khoaTuyenNam2)
      );

      const soKhop: RowSoKhopNganhDaoTao[] = [];
      const oldSubjecs: MonHocEntity[] = [];

      for (const first of firstSubjects) {
        const row: RowSoKhopNganhDaoTao = {
          first: first,
          second: []
        };
        let index = 0;
        const length = secondSubjects.length;
        for (index = 0; index < length; index++) {
          if (first.ma === secondSubjects[index].ma) {
            row.second.push(secondSubjects[index]);
            soKhop.push(row);
            secondSubjects.splice(index, 1);
            break;
          }
        }
        if (index === length) {
          oldSubjecs.push(first);
        }
      }

      for (const oldSunject of oldSubjecs) {
        const row: RowSoKhopNganhDaoTao = {
          first: oldSunject,
          second: []
        };
        let current: MonHocEntity[] = [oldSunject]; // Danh sách tìm kiếm môn học thay thế hiện tại
        for (let i = Number(khoaTuyenNam1); i <= Number(khoaTuyenNam2); i++) {
          const next: MonHocEntity[] = []; // Danh sách tìm kiếm môn học thay thế cho năm tiếp theo
          for (let j = 0; j < current.length; j++) {
            //const monThayThe = await this.monHocTruocService.getMonHocThayTheV2(current[j].id); //Danh sách môn thay thế theo năm
            const monThayThe = await this.chiTietGomNhomService.getMonHocThayThe(current[j].id);
            if (monThayThe.length === 0) {
              // Không tìm thấy môn thay thế tại năm i
              next.push(current[j]);
              break;
            }
            for (const e of monThayThe) {
              let index = 0;
              const lenght = secondSubjects.length;
              for (; index < lenght; index++) {
                //Tìm môn học phù hợp
                if (secondSubjects[index].ma === e.ma) {
                  row.second.push(e);
                  secondSubjects.splice(index, 1);
                  current.splice(j, 1);
                  break;
                }
              }
              if (index === lenght)
                //Không tìm thấy môn học phù hợp
                next.push(e); // Thêm vào danh sách tìm vào lần tiếp theo
            }
          }
          current = next;
        }
        soKhop.push(row);
      }

      secondSubjects.forEach((e) => {
        soKhop.push({
          first: null,
          second: [e]
        });
      });
      result = soKhop;
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CHI_TIET_GOM_NHOM_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }
  async updateSoKhopMonHoc(idNganh: number, body: UpdateSoKhopRequestBody, user: UsersEntity) {
    const { khoaTuyenNam1, khoaTuyenNam2 } = body;
    const ctmhArr = [];
    const ctmhTrcArr = [];
    body.contents.forEach((e) => {
      if (!ctmhArr.includes(e.idChiTietGomNhom)) {
        ctmhArr.push(e.idChiTietGomNhom);
      }
      if (!ctmhTrcArr.includes(e.idChiTietMonHocTrc)) {
        ctmhTrcArr.push(e.idChiTietMonHocTrc);
      }
    });
    const [chiTietGomNhom, totals] = await this.chiTietGomNhomService.getChiTietGomNhomByKhoaAndNganh(
      idNganh,
      khoaTuyenNam2,
      ctmhArr
    );
    if (ctmhArr.length != totals) {
      throw new BadRequestException(`${SOKHOP_MESSAGE.CHITIETGOMNHOM_NOT_IN}_${khoaTuyenNam2}`);
    }
    const [chiTietGomNhomTrc, totalsTrc] = await this.chiTietGomNhomService.getChiTietGomNhomByKhoaAndNganh(
      idNganh,
      khoaTuyenNam1,
      ctmhTrcArr
    );
    if (ctmhTrcArr.length != totalsTrc) {
      throw new BadRequestException(`${SOKHOP_MESSAGE.CHITIETGOMNHOM_MONHOCTRUOC_NOT_IN}_${khoaTuyenNam2}`);
    }
    chiTietGomNhom.forEach((ctgnE) => {
      const row = body.contents.find((e) => e.idChiTietGomNhom == ctgnE.id);
      ctgnE.ctgnMonHoctruoc = chiTietGomNhomTrc.find((e) => e.id == row.idChiTietMonHocTrc);
      ctgnE.updatedBy = user.id;
      ctgnE.updatedAt = new Date();
    });
    try {
      await this.chiTietGomNhomService.updateMonHocTruoc(chiTietGomNhom);
    } catch (error) {
      throw new InternalServerErrorException(SOKHOP_MESSAGE.UPDATE_MONHOCTRUOC_FAILED);
    }
  }
}
