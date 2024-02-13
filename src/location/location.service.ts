import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { AddLocationDTO } from './dtos/addLocation.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async findAll(): Promise<Location[]> {
    return await this.locationRepository.find();
  }

  async findById(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
    });
    return location;
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.findById(id);
    if (!location) {
      throw new NotFoundException(`No location found with that id`);
    }
    return location;
  }

  async findByName(name: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { locationAddress: name },
    });
    if (!location) {
      throw new NotFoundException(`No location found with that address`);
    }
    return location;
  }

  async checkIflocationExists(name: string): Promise<boolean> {
    return await this.locationRepository.exists({
      where: { locationAddress: name },
    });
  }

  async create(addlocationDto: AddLocationDTO): Promise<Location> {
    const { locationAddress } = addlocationDto;
    const exists = await this.checkIflocationExists(locationAddress);
    if (exists) {
      throw new ConflictException('location with that address already exists');
    }
    const location = new Location();
    location.locationAddress = locationAddress;
    return await this.locationRepository.save(location);
  }

  async update(id: string, addlocationDto: AddLocationDTO): Promise<Location> {
    const { locationAddress } = addlocationDto;
    const location = await this.locationRepository.findOne({
      where: { id },
    });
    location.locationAddress = locationAddress;
    return await this.locationRepository.save(location);
  }

  async delete(id: string): Promise<void> {
    await this.locationRepository.delete(id);
  }
}
