import { Injectable } from '@nestjs/common';
import { KhoiKienThucService } from 'khoi-kien-thuc/khoi-kien-thuc.service';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { MonHocService } from 'mon-hoc/mon-hoc.service';
import { FilterSoKhopNganhDaoTao } from './dto/filter-so-khop.dto';
import { RowSoKhopNganhDaoTao } from './dto/row-so-khop.dto';

@Injectable()
export class SoKhopService {
  constructor(private khoiKienThucService: KhoiKienThucService, private monHocService: MonHocService) {}
  async soKhopNganhDaotao(id: number, filter: FilterSoKhopNganhDaoTao) {
    const { khoaTuyenNam1, khoaTuyenNam2 } = filter;
    const firstSubjects: MonHocEntity[] = await this.khoiKienThucService.getAllByNganhDaoTaoAndKhoaTuyen(
      id,
      Number(khoaTuyenNam1)
    );
    const secondSubjects: MonHocEntity[] = await this.khoiKienThucService.getAllByNganhDaoTaoAndKhoaTuyen(
      id,
      Number(khoaTuyenNam2)
    );

    // type rowSoKhop = {
    //   first: MonHocEntity;
    //   second: MonHocEntity[];
    // };
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
      let currentSubject = [oldSunject];
      for (let i = Number(khoaTuyenNam1); i <= Number(khoaTuyenNam2); i++) {
        const next: MonHocEntity[] = [];
        for (const current of currentSubject) {
          const thayThe = await this.monHocService.getMonHocThayThe(current.id);
          for (const e of thayThe) {
            for (let index = 0; index < secondSubjects.length; index++) {
              if (secondSubjects[index].ma === e.ma) {
                row.second.push(e);
                secondSubjects.splice(index, 1);
                break;
              } else {
                next.push(e);
              }
            }
          }
        }
        currentSubject = next;
      }
      soKhop.push(row);
    }
    secondSubjects.forEach((e) => {
      soKhop.push({
        first: null,
        second: [e]
      });
    });
    return soKhop;
  }
}
