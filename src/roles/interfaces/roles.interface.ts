export interface IRole {
  readonly id: number;
  readonly name: string;
  readonly value: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly isDeleted?: boolean;
}
