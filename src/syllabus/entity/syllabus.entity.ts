import { MonHocEntity } from "mon-hoc/entity/monHoc.entity";
import { SchoolYear } from "school-year/entity/school-year.entity";
import { TypeOfEducation } from "type-of-education/entity/type-of-education.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "users/entity/user.entity";

@Entity("Syllabus")
export class Syllabus {
    @PrimaryGeneratedColumn()
    id:number;

    // @Column({name:'idMH'})
    // idSubject:number;
    @ManyToOne(() => MonHocEntity)
    @JoinColumn({name:'idMH'})
    subject:MonHocEntity;

    //@Column({name:'idHDT'})
    @ManyToOne(() => TypeOfEducation)
    @JoinColumn({name:'idHDT'})
    typeOfEdu:TypeOfEducation;

    //@Column({name:'idNH'})
    @ManyToOne(()=>SchoolYear)
    @JoinColumn({name:'idNH'})
    schoolYear:SchoolYear;

    //@Column({name:'idUser'})
    @ManyToOne(() => UsersEntity,user=>user.ID)
    @JoinColumn({name:'idUser'})
    author:UsersEntity;

    @Column({name:'updatedAt'})
    updatedAt:Date;

    @Column({name:'ceatedAt'})
    createdAt:Date;
}
