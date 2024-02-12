import { Module } from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderController } from './rider.controller';

@Module({
  providers: [RiderService],
  controllers: [RiderController],
})
export class RiderModule {}
