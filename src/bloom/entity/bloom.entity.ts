import { TABLE_NAME } from 'constant/constant';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: TABLE_NAME.BLOOM })
export class BloomEntity {
  @PrimaryColumn({ name: 'mucDo' })
  mucDo: string;
  @Column({ name: 'dongTu' })
  dongTu: string;
  @PrimaryColumn({ name: 'verb' })
  verb: string;
}
