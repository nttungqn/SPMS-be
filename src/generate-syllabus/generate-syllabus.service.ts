import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { ChuDeService } from 'chu-de/chu-de.service';
import { ChuanDauRaMonHocService } from 'chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.service';
import { HoatDongDanhGiaService } from 'hoat-dong-danh-gia/hoat-dong-danh-gia.service';
import { HoatDongDayHocService } from 'hoat-dong-day-hoc/hoat-dong-day-hoc.service';
import { LoaiDanhGiaService } from 'loai-danh-gia/loai-danh-gia.service';
import { MucTieuMonHocService } from 'muc-tieu-mon-hoc/muc-tieu-mon-hoc.service';
import { Syllabus } from 'syllabus/entity/syllabus.entity';
import { SyllabusService } from 'syllabus/syllabus.service';
import { UsersEntity } from 'users/entity/user.entity';
import { SyllabusDto } from './dto/syllabus.dto';

@Injectable()
export class GenerateSyllabusService {
  constructor(
    private syllabusService: SyllabusService,
    private mucTieuMonHocService: MucTieuMonHocService,
    private chuanDauRaMonHocService: ChuanDauRaMonHocService,
    private loaiDanhGiaService: LoaiDanhGiaService,
    private hoatDongDanhGiaService: HoatDongDanhGiaService,
    private hoatDongDayHocService: HoatDongDayHocService,
    private chuDeService: ChuDeService
  ) {}
  async put(data: SyllabusDto, syllabusId: number, user: UsersEntity): Promise<any> {
    try {
      // 1
      const syllabusObjUpdate = new Syllabus();
      syllabusObjUpdate.quiDinh = data?.rule_rule;
      syllabusObjUpdate.taiNguyen = data?.resource_resource;
      syllabusObjUpdate.moTa = data?.description_subjectDescription;
      const syllabus = await this.syllabusService.update(syllabusId, syllabusObjUpdate, user);

      // 2
      const subjectGoals = await this.mucTieuMonHocService.addList(data?.goal_subjectGoals, user);

      // 3
      // #TODO update id muc_tieu_mon_hoc
      JSON.parse(JSON.stringify(data?.outputStandard_subjectOutputStandards));
      let subjectOutputStandardsData = JSON.parse(JSON.stringify(data?.outputStandard_subjectOutputStandards));
      subjectOutputStandardsData = subjectOutputStandardsData.map((sOS) => {
        data?.goal_subjectGoals.forEach((sG, index) => {
          if (sOS.mucTieuMonHoc === sG.id) sOS.mucTieuMonHoc = subjectGoals[index].id;
        });
        return sOS;
      });

      // 4
      const subjectOutputStandards = await this.chuanDauRaMonHocService.addList(subjectOutputStandardsData, user);

      // 5
      // #TODO update id
      let evaluationTypes = JSON.parse(JSON.stringify(data?.evaluation_evaluationTypes));
      evaluationTypes = evaluationTypes.map((eT) => {
        // array string or array number
        const etCopy = eT;
        data?.outputStandard_subjectOutputStandards.forEach((sOS, i) => {
          eT.chuanDauRaMonHoc.forEach((value, j) => {
            if (value.toString() === sOS.id.toString())
              etCopy.chuanDauRaMonHoc[j] = subjectOutputStandards[i].id.toString();
          });
        });
        etCopy.idSyllabus = +syllabusId;
        return etCopy;
      });

      // #TODO update id
      let evaluationActivities = JSON.parse(JSON.stringify(data?.evaluation_evaluationActivities));
      evaluationActivities = evaluationActivities.map((eA) => {
        const eACopy = eA;
        data?.outputStandard_subjectOutputStandards.forEach((sOS, i) => {
          eA.chuanDauRaMonHoc.forEach((value, j) => {
            if (value.toString() === sOS.id.toString())
              eACopy.chuanDauRaMonHoc[j] = subjectOutputStandards[i].id.toString();
          });
        });
        return eACopy;
      });

      // #TODO update id
      let theoreticalTeachingPlanTopics = JSON.parse(JSON.stringify(data?.theoreticalTeachingPlan_topics));
      theoreticalTeachingPlanTopics = theoreticalTeachingPlanTopics.map((tTPT) => {
        const tTPTCopy = tTPT;
        data?.outputStandard_subjectOutputStandards.forEach((sOS, i) => {
          tTPT.chuanDauRaMonHoc.forEach((value, j) => {
            if (value.toString() === sOS.id.toString())
              tTPTCopy.chuanDauRaMonHoc[j] = subjectOutputStandards[i].id.toString();
          });
        });
        tTPTCopy.idSyllabus = +syllabusId;
        return tTPTCopy;
      });

      // #TODO update id
      let practiceTeachingPlanTopics = JSON.parse(JSON.stringify(data?.practiceTeachingPlan_topics));
      practiceTeachingPlanTopics = data?.practiceTeachingPlan_topics.map((tTPT) => {
        const tTPTCopy = tTPT;
        data?.outputStandard_subjectOutputStandards.forEach((sOS, i) => {
          tTPT.chuanDauRaMonHoc.forEach((value, j) => {
            if (value.toString() === sOS.id.toString())
              tTPTCopy.chuanDauRaMonHoc[j] = subjectOutputStandards[i].id.toString();
          });
        });
        tTPTCopy.idSyllabus = +syllabusId;
        return tTPTCopy;
      });

      // 6
      const evaluationTypesBeSaved = await this.loaiDanhGiaService.addList(evaluationTypes, user, syllabusId);
      console.log(evaluationTypesBeSaved);
      // 7
      evaluationActivities = evaluationActivities.map((eA) => {
        const eACopy = eA;
        data?.evaluation_evaluationTypes.forEach((value, i) => {
          if (value.id.toString() === eA.loaiDanhGia.toString()) eACopy.loaiDanhGia = evaluationTypesBeSaved[i].id;
        });
        return eACopy;
      });

      // 8
      const evaluationActivitiesSaved = await this.hoatDongDanhGiaService.addList(
        evaluationActivities,
        user,
        syllabusId
      );
      console.log(evaluationActivitiesSaved);

      // 9
      theoreticalTeachingPlanTopics = theoreticalTeachingPlanTopics.map((tTP) => {
        const tTPCopy = tTP;
        data?.evaluation_evaluationActivities.forEach((eA, i) => {
          tTP.hoatDongDanhGia.forEach((value, j) => {
            if (value.toString() === eA.id.toString())
              tTPCopy.hoatDongDanhGia[j] = evaluationActivitiesSaved[i].id.toString();
          });
        });
        return tTPCopy;
      });

      practiceTeachingPlanTopics = practiceTeachingPlanTopics.map((tTP) => {
        const tTPCopy = tTP;
        data?.evaluation_evaluationActivities.forEach((eA, i) => {
          tTP.hoatDongDanhGia.forEach((value, j) => {
            if (value.toString() === eA.id.toString())
              tTPCopy.hoatDongDanhGia[j] = evaluationActivitiesSaved[i].id.toString();
          });
        });
        return tTPCopy;
      });

      // 10
      const teachingActivitiesSaved = await this.hoatDongDayHocService.addList(
        data?.teachingActivity_teachingActivities,
        user
      );

      // 11
      theoreticalTeachingPlanTopics = theoreticalTeachingPlanTopics.map((tTP) => {
        const tTPCopy = tTP;
        data?.teachingActivity_teachingActivities.forEach((eA, i) => {
          tTP.hoatDongDayHoc.forEach((value, j) => {
            if (value.toString() === eA.id.toString())
              tTPCopy.hoatDongDayHoc[j] = teachingActivitiesSaved[i].id.toString();
          });
        });
        return tTPCopy;
      });

      practiceTeachingPlanTopics = practiceTeachingPlanTopics.map((tTP) => {
        const tTPCopy = tTP;
        data?.teachingActivity_teachingActivities.forEach((eA, i) => {
          tTP.hoatDongDayHoc.forEach((value, j) => {
            if (value.toString() === eA.id.toString())
              tTPCopy.hoatDongDayHoc[j] = teachingActivitiesSaved[i].id.toString();
          });
        });
        return tTPCopy;
      });

      // 12
      const topics = theoreticalTeachingPlanTopics.concat(practiceTeachingPlanTopics);
      await this.chuDeService.addList(topics, user);
      return;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
