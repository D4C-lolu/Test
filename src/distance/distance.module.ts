import { Module } from '@nestjs/common';
import { DistanceService } from './distance.service';
import { DistanceController } from './distance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Distance } from './entities/distance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Distance])],
  providers: [DistanceService],
  controllers: [DistanceController],
})
export class DistanceModule {}
