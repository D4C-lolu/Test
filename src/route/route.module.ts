import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Distance } from 'src/distance/entities/distance.entity';
import { Rider } from 'src/rider/entities/rider.entity';
import { Route } from './entities/route.entity';
import { Location } from 'src/location/entities/location.entity';
import { DistanceService } from 'src/distance/distance.service';
import { LocationService } from 'src/location/location.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rider, Route, Location, Distance])],
  providers: [RouteService, DistanceService, LocationService],
  controllers: [RouteController],
})
export class RouteModule {}
