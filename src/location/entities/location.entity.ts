import { BaseAbstractEntity } from 'src/common/database/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('locations')
export class Location extends BaseAbstractEntity {
  @Column({ name: 'location_address', nullable: false, unique: true })
  locationAddress: string;
}
