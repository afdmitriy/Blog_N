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

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  public updatedAt: Date | null = null;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  public deletedAt: Date
}