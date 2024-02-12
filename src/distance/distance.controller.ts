import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DistanceService } from './distance.service';
import { AddDistanceDTO } from './dtos/addDistance.dto';

@Controller('distance')
export class DistanceController {
  constructor(private readonly distanceService: DistanceService) {}

  @Post()
  public async createDistance(@Body() addDistanceDto: AddDistanceDTO) {
    return await this.distanceService.create(addDistanceDto);
  }

  @Get()
  public async getDistances() {
    return await this.distanceService.findAll();
  }

  @Get('/:id')
  public async getDistance(@Param() id: string) {
    return await this.distanceService.findOne(id);
  }

  @Get('/:from/:to')
  public async getDistanceByLocation(
    @Param() from: string,
    @Param() to: string,
  ) {
    return await this.distanceService.findByLocation(from, to);
  }

  @Get('/:locationId/adjacent')
  public async getAdjacentLocations(@Param() locationId: string) {
    return await this.distanceService.findAdjacentLocations(locationId);
  }

  @Patch('/:id')
  public async updateDistance(@Body() distance: number, @Param() id: string) {
    return await this.distanceService.update(id, distance);
  }
}
