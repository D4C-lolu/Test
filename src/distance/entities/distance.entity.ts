import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseAbstractEntity } from 'src/common/database/base.entity';
import { Location } from 'src/location/entities/location.entity';

@Entity('distances')
@Index(['fromLocation', 'toLocation'], { unique: true })
export class Distance extends BaseAbstractEntity {
  @ManyToOne(() => Location)
  @JoinColumn({ name: 'from_location_id' })
  fromLocation: Location;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'to_location_id' })
  toLocation: Location;

  @Column()
  distance: number;
}
