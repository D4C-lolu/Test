import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class AddDistanceDTO {
  @IsNotEmpty({ message: 'From location is required' })
  @IsString()
  fromLocation: string;

  @IsNotEmpty({ message: 'To location is required' })
  @IsString()
  toLocation: string;

  @IsNotEmpty({ message: 'Distance is required' })
  @IsPositive()
  @IsNumber()
  distance: number;
}
