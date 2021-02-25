import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsInt } from "class-validator";
import { TABLE_NAME } from "constant/constant";
import { MonHocEntity } from "mon-hoc/entity/monHoc.entity";
import { SchoolYear } from "school-year/entity/school-year.entity";
import { TypeOfEducation } from "type-of-education/entity/type-of-education.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "users/entity/user.entity";

@Entity(TABLE_NAME.SYLLABUS)
export class Syllabus {

    @PrimaryGeneratedColumn()
    id:number;

    @ApiProperty()
    @IsInt()
    @Column({name:'idMH'})
    @ManyToOne(() => MonHocEntity)
    @JoinColumn({name:'idMH'})
    subject:number;

    @ApiProperty()
    @IsInt()
    @Column({name:'idHDT'})
    @ManyToOne(() => TypeOfEducation)
    @JoinColumn({name:'idHDT'})
    typeOfEdu:number;

    @ApiProperty()
    @IsInt()
    @Column({name:'idNH'})
    @ManyToOne(()=>SchoolYear)
    @JoinColumn({name:'idNH'})
    schoolYear:number;

    @Column({name:'createdBy'})
    @ManyToOne(() => UsersEntity)
    @JoinColumn({name:'createdBy'})
    author:number;


    @Column({name:'updatedBy'})
    @ManyToOne(() => UsersEntity)
    @JoinColumn({name:'updatedBy'})
    updateBy:number;

    @Column({name:'updatedAt'})
    updatedAt:Date;

    @Column({name:'ceatedAt'})
    createdAt:Date;

    @Column({name:"isDeleted"})
    isDeleted:Boolean
}
