import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RouteService } from './route.service';
import { AddRouteDTO } from './dtos/addRoute.dto';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get()
  public async getRoutes() {
    return await this.routeService.findAll();
  }

  @Get('/:id')
  public async getRoute(@Param() id: string) {
    return await this.routeService.findOne(id);
  }

  @Post()
  public async createRoute(@Body() addRouteDto: AddRouteDTO) {
    return await this.routeService.create(addRouteDto);
  }

  @Post('/:from/to/:to')
  public async getRouteByLocation(@Param() from: string, to: string) {
    return await this.routeService.findRouteBetweenLocations(from, to);
  }
}
