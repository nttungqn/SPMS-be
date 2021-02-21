import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('NamHoc')
export class SchoolYear {
    @PrimaryGeneratedColumn({name:'id'})
    id:number;
    @Column({name:'ma'})
    code:string;
    @Column({name:'ten'})
    name:string;
    @Column({name:'isDeleted'})
    isDeleted:boolean;
}
