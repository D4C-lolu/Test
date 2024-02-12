import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RiderService } from './rider.service';
import { AddRiderDTO } from './dto/addRider.dto';

@Controller('rider')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post()
  public async createRider(@Body() addRiderDto: AddRiderDTO) {
    return await this.riderService.create(addRiderDto);
  }

  @Get()
  public async getRiders() {
    return await this.riderService.findAll();
  }

  @Get('/:id')
  public async getRider(@Param() id: string) {
    return await this.riderService.findOne(id);
  }
}
