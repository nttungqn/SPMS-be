import { Injectable } from '@nestjs/common';
import { ChuDeEntity } from 'chu-de/entity/chu-de.entity';
import { ChuanDauRaMonHocEntity } from 'chuan-dau-ra-mon-hoc/entity/chuan-dau-ra-mon-hoc.entity';
import { ChuanDauRaEntity } from 'chuan-dau-ra/entity/chuanDauRa.entity';
import { ChuongTrinhDaoTaoService } from 'chuong-trinh-dao-tao/chuong-trinh-dao-tao.service';
import { CtdtService } from 'ctdt/ctdt.service';
import { Role } from 'guards/roles.enum';
import { MucTieuMonHocEntity } from 'muc-tieu-mon-hoc/entity/muc-tieu-mon-hoc.entity';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Connection, getConnection } from 'typeorm';
import { UsersService } from 'users/users.service';
import { IntroPageInfo } from './dto/intro-page.dto';
import { ThongKeChuanDauRaRow } from './dto/row-thong-ke-chuan-dau-ra.dto';
import { ThongKeGiaoVien } from './dto/thong-ke-giao-vien.dto';

@Injectable()
export class ThongKeService {
  constructor(
    private syllabusService: SyllabusService,
    private chuongTrinhDaotaoService: ChuongTrinhDaoTaoService,
    private nganhDaoTaoService: CtdtService,
    private userService: UsersService
  ) {}
  async thongKeGiaoVien(idGiaoVien: number): Promise<ThongKeGiaoVien> {
    const thongKeGiaoVien = new ThongKeGiaoVien();
    thongKeGiaoVien.totalSyllabus = await this.syllabusService.getCountSyllabus(idGiaoVien);
    return thongKeGiaoVien;
  }
  async intro(): Promise<IntroPageInfo> {
    const introPageInfo = new IntroPageInfo();

    introPageInfo.toTalSyllabus = await this.syllabusService.getCountSyllabus();
    introPageInfo.totalStudent = await this.userService.getCountUser(Role.SINHVIEN);
    introPageInfo.totalTeacher = await this.userService.getCountUser(Role.GIAOVIEN);
    introPageInfo.totalCTDDT = await this.chuongTrinhDaotaoService.getCountCTDT();
    introPageInfo.totalNganhDaoTao = await this.nganhDaoTaoService.getCount();

    return introPageInfo;
  }

  async thongKeSoLuongChuanDauRaTrongSyllabus(idSyllabus: number) {
    const isDeleted = false;
    const con: Connection = getConnection();
    await this.syllabusService.findOne(idSyllabus);
    const query = con
      .getRepository(ChuDeEntity)
      .createQueryBuilder('cd')
      .leftJoin('cd.chuanDauRaMonHoc', 'cdrmh', 'cdrmh.isDeleted = :isDeleted', { isDeleted })
      .select('cdrmh.id as idCDRMH')
      .addSelect('cdrmh.idMTMH')
      .addSelect('COUNT(cd.tuan) AS count_tuan')
      .where('cd.idSyllabus = :idSyllabus', { idSyllabus })
      .andWhere('cd.idLKHGD = 2')
      .andWhere('cd.isDeleted = :isDeleted', { isDeleted })
      .groupBy('cdrmh.ma');
    const chuanDauRaMonHocCountByTuan: {
      idCDRMH: number;
      idMTMH: number;
      count_tuan: number;
    }[] = await query.getRawMany();

    //return chuanDauRaMonHocCountByTuan;
    const queryMuTieuMonHoc = await con
      .getRepository(MucTieuMonHocEntity)
      .find({ isDeleted: false, syllabus: idSyllabus });
    const result = [];
    for (const mtmh of queryMuTieuMonHoc) {
      const row = new ThongKeChuanDauRaRow();
      row.mucTieuMonHoc = mtmh;

      for (const cdrmh of chuanDauRaMonHocCountByTuan) {
        if (cdrmh.idMTMH === mtmh.id) {
          const cdrmhEntiy = await con
            .getRepository(ChuanDauRaMonHocEntity)
            .findOne({ id: Number(cdrmh.idCDRMH), isDeleted: false });
          row.count += Number(cdrmh.count_tuan);
          row.chuanDauRaMonHoc.push({ cdrmh: cdrmhEntiy, count: Number(cdrmh.count_tuan) });
        }
      }
      result.push(row);
    }
    return result;
  }
}
