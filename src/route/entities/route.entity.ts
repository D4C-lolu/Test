import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Rider } from 'src/rider/entities/rider.entity';
import { Location } from 'src/location/entities/location.entity';
import { BaseAbstractEntity } from 'src/common/database/base.entity';

@Entity('routes')
@Index(['pickupLocation', 'dropoffLocation', 'rider'], { unique: true })
export class Route extends BaseAbstractEntity {
  @ManyToOne(() => Rider)
  @JoinColumn({ name: 'rider_id' })
  rider: Rider;

  @ManyToOne(() => Location, { nullable: false })
  @JoinColumn({ name: 'pickup_location_id' })
  pickupLocation: Location;

  @ManyToOne(() => Location, { nullable: false })
  @JoinColumn({ name: 'dropoff_location_id' })
  dropoffLocation: Location;

  @Column({ nullable: false })
  price: number;
}
