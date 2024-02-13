import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Distance } from './entities/distance.entity';
import { AddDistanceDTO } from './dtos/addDistance.dto';

@Injectable()
export class DistanceService {
  constructor(
    @InjectRepository(Distance)
    private readonly distanceRepository: Repository<Distance>,
  ) {}

  async findAll(): Promise<Distance[]> {
    return await this.distanceRepository.find();
  }

  async findOne(id: string): Promise<Distance> {
    const distance = await this.distanceRepository.findOne({
      where: { id },
      relations: ['fromLocation', 'toLocation'],
    });
    if (!distance) {
      throw new NotFoundException(`No distance found with that id`);
    }
    return distance;
  }

  async findByLocation(from: string, to: string): Promise<Distance> {
    const distance = await this.findDistance(from, to);
    if (!distance) {
      throw new NotFoundException(`No distance found with those co-ordinates `);
    }
    return distance;
  }

  async findDistance(from: string, to: string): Promise<Distance> {
    const distance = await this.distanceRepository.findOne({
      where: { fromLocation: { id: from }, toLocation: { id: to } },
      relations: ['fromLocation', 'toLocation'],
    });
    return distance;
  }

  async findAdjacentLocations(locationId: string): Promise<Distance[]> {
    const location = await this.findOne(locationId);
    const nextLocations = await this.distanceRepository.find({
      where: { id: location.toLocation.id },
    });
    return nextLocations;
  }

  async checkIfdistanceExists(from: string, to: string): Promise<boolean> {
    return await this.distanceRepository.exists({
      where: { fromLocation: { id: from }, toLocation: { id: to } },
    });
  }

  async create(adddistanceDto: AddDistanceDTO): Promise<Distance> {
    const { fromLocation, toLocation, distance } = adddistanceDto;
    const exists = await this.checkIfdistanceExists(fromLocation, toLocation);
    if (exists) {
      throw new ConflictException(
        'Distance for those locations already exists',
      );
    }
    const newDistance = await this.distanceRepository.save({
      fromLocation: { id: fromLocation },
      toLocation: { id: toLocation },
      distance,
    });
    return newDistance;
  }

  async update(id: string, distance: number): Promise<Distance> {
    await this.distanceRepository.update(id, {
      distance,
    });
    return await this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.distanceRepository.delete(id);
  }
}
