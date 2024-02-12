import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { ModifiedBy } from '../types';

export abstract class BaseAbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({
  //   type: 'json',
  //   nullable: false,
  //   name: 'created_by',
  // })
  // createdBy: ModifiedBy;

  // @Column({
  //   type: 'json',
  //   nullable: true,
  //   name: 'updated_by',
  // })
  // updatedBy: ModifiedBy;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMPTZ',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMPTZ',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
