import { Location } from 'src/location/entities/location.entity';
export interface ModifiedBy {
  id: string;
  name: string;
  email: string;
  additionalDetails?: string;
}

export interface DeliveryRoute {
  routeLocations: Location[];
  totalPrice: number;
  totalDistance: number;
  totalTime: number;
}
