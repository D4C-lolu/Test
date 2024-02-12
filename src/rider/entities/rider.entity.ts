import { BaseAbstractEntity } from 'src/common/database/base.entity';
import { Route } from 'src/route/entities/route.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('riders')
export class Rider extends BaseAbstractEntity {
  @Column({ name: 'rider_name', nullable: false, unique: true })
  riderName: string;

  @OneToMany(() => Route, (route) => route.rider)
  routes: Route[];
}
