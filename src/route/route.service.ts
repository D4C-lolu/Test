import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';
import { AddRouteDTO } from './dtos/addRoute.dto';
import { DeliveryRoute } from 'src/common/types';
import { Distance } from 'src/distance/entities/distance.entity';
import { DistanceService } from 'src/distance/distance.service';
import { LocationService } from 'src/location/location.service';
import { Location } from 'src/location/entities/location.entity';

@Injectable()
export class RouteService {
  speed = 60;
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Distance)
    private readonly distanceRepository: Repository<Distance>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly distanceService: DistanceService,
    private readonly locationService: LocationService,
  ) {}

  async findAll(): Promise<Route[]> {
    return await this.routeRepository.find();
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['pickupLocation', 'dropoffLocation, rider'],
    });
    if (!route) {
      throw new NotFoundException(`No route found with that id`);
    }
    return route;
  }

  async findByLocation(from: string, to: string): Promise<Route[]> {
    const route = await this.routeRepository.find({
      where: { pickupLocation: { id: from }, dropoffLocation: { id: to } },
      relations: ['pickupLocation', 'dropoffLocation, rider'],
      order: { price: 'ASC' },
    });
    return route;
  }

  async checkIfRouteExistsForDriver({
    from,
    to,
    rider,
  }: {
    from: string;
    to: string;
    rider: string;
  }): Promise<boolean> {
    return await this.routeRepository.exists({
      where: {
        pickupLocation: { id: from },
        dropoffLocation: { id: to },
        rider: { id: rider },
      },
    });
  }

  async findRouteBetweenLocations(
    fromLocation: string,
    toLocation: string,
  ): Promise<DeliveryRoute[]> {
    const result: DeliveryRoute[] = [];
    const starterLocation = await this.locationService.findById(fromLocation);
    const destinationLocation = await this.locationService.findById(toLocation);
    const routes = await this.findByLocation(fromLocation, toLocation);
    routes.forEach(async (route) => {
      const distance = await this.distanceService.findDistance(
        route.pickupLocation.id,
        route.dropoffLocation.id,
      );
      result.push({
        routeLocations: [route.pickupLocation, route.dropoffLocation],
        totalPrice: route.price,
        totalTime: distance.distance / this.speed,
        totalDistance: distance.distance,
      });
    });

    //Now do BFS
    const visited: string[] = [];
    const queue: string[] = [starterLocation.id];
    const parent: { [key: string]: string } = {};
    while (queue.length > 0) {
      const currentLocation = queue.shift();
      visited.push(currentLocation);
      if (currentLocation === destinationLocation.id) {
        let current = currentLocation;
        const routeLocations: Location[] = [];
        let totalPrice = 0;
        let totalDistance = 0;
        let totalTime = 0;
        //Backtrack
        while (current !== starterLocation.id) {
          const previous = parent[current];
          //route[0] is the cheapest route (sorted by price in findByLocation method)
          const routes = await this.findByLocation(previous, current);
          const distance = await this.distanceService.findByLocation(
            previous,
            current,
          );
          routeLocations.push(
            ...(await this.locationRepository.findByIds([
              routes[0].pickupLocation.id,
              routes[0].dropoffLocation.id,
            ])),
          );
          totalPrice += routes[0].price;
          totalDistance += distance.distance;
          totalTime += distance.distance / this.speed;
          current = previous;
        }
        result.push({
          routeLocations: routeLocations.reverse(),
          totalPrice,
          totalDistance,
          totalTime,
        });
      }
      const adjacentLocations =
        await this.distanceService.findAdjacentLocations(currentLocation);
      for (const adjacentLocation of adjacentLocations) {
        if (!visited.includes(adjacentLocation.id)) {
          queue.push(adjacentLocation.id);
          parent[adjacentLocation.id] = currentLocation;
        }
      }
    }
    result.sort((a, b) => a.totalPrice - b.totalPrice);
    return result;
  }

  async create(addRouteDto: AddRouteDTO): Promise<Route> {
    const { pickupLocation, dropoffLocation, rider, price } = addRouteDto;
    const exists = await this.checkIfRouteExistsForDriver({
      from: pickupLocation,
      to: dropoffLocation,
      rider,
    });
    if (exists) {
      throw new ConflictException(
        'Route for those points and that rider already exists',
      );
    }
    const newroute = await this.routeRepository.save({
      pickupLocation: { id: pickupLocation },
      dropoffLocation: { id: dropoffLocation },
      rider: { id: rider },
      price,
    });
    return newroute;
  }

  async update(id: string, price: number): Promise<Route> {
    await this.routeRepository.update(id, {
      price,
    });
    return await this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.routeRepository.delete(id);
  }
}
