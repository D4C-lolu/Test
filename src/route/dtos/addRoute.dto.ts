import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class AddRouteDTO {
  @IsNotEmpty({ message: 'Rider is required' })
  @IsString()
  rider: string;

  @IsNotEmpty({ message: 'Pick up location is required' })
  @IsString()
  pickupLocation: string;

  @IsNotEmpty({ message: 'Drop off location is required' })
  @IsString()
  dropoffLocation: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsPositive()
  @IsNumber()
  price: number;
}
