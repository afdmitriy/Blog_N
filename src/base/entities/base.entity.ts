import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseTypeORMEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  // https://typeorm.io/entities#special-columns
  @CreateDateColumn({ type: 'timestamp with time zone' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  public deletedAt: Date
}