import { Injectable } from '@nestjs/common';
import { ChiTietNganhDaoTaoService } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.service';
import { KhoiKienThucService } from 'khoi-kien-thuc/khoi-kien-thuc.service';
import { MonHocTruocService } from 'mon-hoc-truoc/mon-hoc-truoc.service';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { FilterSoKhopNganhDaoTao } from './dto/filter-so-khop.dto';
import { RowSoKhopNganhDaoTao } from './dto/row-so-khop.dto';

@Injectable()
export class SoKhopService {
  constructor(
    private khoiKienThucService: KhoiKienThucService,
    private monHocTruocService: MonHocTruocService,
    private chiTietNganhDaotaoService: ChiTietNganhDaoTaoService
  ) {}
  async soKhopNganhDaoTao(idNganhDaoTao: number, filter: FilterSoKhopNganhDaoTao) {
    const { khoaTuyenNam1, khoaTuyenNam2 } = filter;
    const chiTietNganhDaotaoKhoa1 = await this.chiTietNganhDaotaoService.getOneByKhoaAndNganhDaoTao(
      Number(khoaTuyenNam1),
      idNganhDaoTao
    );
    const chiTietNganhDaotaoKhoa2 = await this.chiTietNganhDaotaoService.getOneByKhoaAndNganhDaoTao(
      Number(khoaTuyenNam2),
      idNganhDaoTao
    );

    const firstSubjects: MonHocEntity[] = await this.khoiKienThucService.getAllSubjectByIdChiTietNganhDaotao(
      chiTietNganhDaotaoKhoa1.id
    );

    const secondSubjects: MonHocEntity[] = await this.khoiKienThucService.getAllSubjectByIdChiTietNganhDaotao(
      chiTietNganhDaotaoKhoa2.id
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
          const monThayThe = await this.monHocTruocService.getMonHocThayThe(current[j].id, i, Number(khoaTuyenNam2)); //Danh sách môn thay thế theo năm
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
    return soKhop;
  }
  async soKhopNganhDaoTaoV2(idNganhDaoTao: number, filter: FilterSoKhopNganhDaoTao) {
    const { khoaTuyenNam1, khoaTuyenNam2 } = filter;
    const chiTietNganhDaotaoKhoa1 = await this.chiTietNganhDaotaoService.getOneByKhoaAndNganhDaoTao(
      Number(khoaTuyenNam1),
      idNganhDaoTao
    );
    const firstSubjects: MonHocEntity[] = await this.khoiKienThucService.getAllSubjectByIdChiTietNganhDaotao(
      chiTietNganhDaotaoKhoa1.id
    );

    const chiTietNganhDaotaoKhoa2 = await this.chiTietNganhDaotaoService.getOneByKhoaAndNganhDaoTao(
      Number(khoaTuyenNam2),
      idNganhDaoTao
    );
    const secondSubjects: MonHocEntity[] = await this.khoiKienThucService.getAllSubjectByIdChiTietNganhDaotao(
      chiTietNganhDaotaoKhoa2.id
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
          const monThayThe = await this.monHocTruocService.getMonHocThayTheV2(current[j].id); //Danh sách môn thay thế theo năm
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
    return soKhop;
  }
}
