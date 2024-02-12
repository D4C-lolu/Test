import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LocationService } from './location.service';
import { AddLocationDTO } from './dtos/addLocation.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  public async createLocation(@Body() addLocationDto: AddLocationDTO) {
    return await this.locationService.create(addLocationDto);
  }

  @Get()
  public async getLocations() {
    return await this.locationService.findAll();
  }

  @Get('/:id')
  public async getLocation(@Param() id: string) {
    return await this.locationService.findOne(id);
  }
}
