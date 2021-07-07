import { TABLE_NAME } from "constant/constant";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name:TABLE_NAME.BLOOM_V2})
export class BloomV2Entity {
    @PrimaryColumn({ name: 'levelEng' })
    levelEng:String;
    @PrimaryColumn({ name: 'verb' })
    verb:String;
    @Column({name:"mucDoVN"})
    mucDoVN:String;
    @Column({name:"dongTu"})
    dongTu:String;
}
