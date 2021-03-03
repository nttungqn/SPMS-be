import { Column } from 'typeorm';

export class ModifyData {
  @Column({ name: 'updatedBy' })
  updatedBy: number;
  @Column({ name: 'createdBy' })
  createdBy: number;
  @Column({ name: 'updatedAt' })
  updatedAt: Date;
  @Column({ name: 'createdAt' })
  createdAt: Date;
  @Column({ name: 'isDeleted' })
  isDeleted: boolean;
}
