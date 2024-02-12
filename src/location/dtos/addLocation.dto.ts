import { IsNotEmpty, IsString } from 'class-validator';

export class AddLocationDTO {
  @IsNotEmpty({ message: 'Location Address is required' })
  @IsString()
  locationAddress: string;
}
