import { Module } from '@nestjs/common';
import { DistanceService } from './distance.service';
import { DistanceController } from './distance.controller';

@Module({
  providers: [DistanceService],
  controllers: [DistanceController]
})
export class DistanceModule {}
