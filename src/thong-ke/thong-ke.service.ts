import { Injectable } from '@nestjs/common';
import { ChuongTrinhDaoTaoService } from 'chuong-trinh-dao-tao/chuong-trinh-dao-tao.service';
import { CtdtService } from 'ctdt/ctdt.service';
import { Role } from 'guards/roles.enum';
import { SyllabusService } from 'syllabus/syllabus.service';
import { UsersService } from 'users/users.service';
import { IntroPageInfo } from './dto/intro-page.dto';
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
}
