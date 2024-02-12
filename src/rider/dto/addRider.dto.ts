import { IsNotEmpty, IsString } from 'class-validator';

export class AddRiderDTO {
  @IsNotEmpty({ message: 'Rider name is required' })
  @IsString()
  riderName: string;
}
