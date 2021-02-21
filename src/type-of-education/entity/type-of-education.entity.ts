import { PrimaryGeneratedColumn,Column, Entity } from "typeorm";
@Entity('HeDaoTao')
export class TypeOfEducation {
    @PrimaryGeneratedColumn({name:'id'})
    id:number;
    @Column({name:'ma'})
    code:string;
    @Column({name:'ten'})
    name:string;
    @Column({name:'isDeleted'})
    isDeleted:boolean;
}
