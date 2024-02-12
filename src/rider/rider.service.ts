import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rider } from './entities/rider.entity';
import { Repository } from 'typeorm';
import { AddRiderDTO } from './dto/addRider.dto';

@Injectable()
export class RiderService {
  constructor(
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
  ) {}

  async findAll(): Promise<Rider[]> {
    return await this.riderRepository.find();
  }

  async findOne(id: string): Promise<Rider> {
    const rider = await this.riderRepository.findOne({
      where: { id },
      relations: ['routes'],
    });
    if (!rider) {
      throw new NotFoundException(`No rider found with that id`);
    }
    return rider;
  }

  async findByName(name: string): Promise<Rider> {
    const rider = await this.riderRepository.findOne({
      where: { riderName: name },
    });
    if (!rider) {
      throw new NotFoundException(`No rider found with that name`);
    }
    return rider;
  }

  async checkIfRiderExists(name: string): Promise<boolean> {
    return await this.riderRepository.exists({
      where: { riderName: name },
    });
  }

  async create(addRiderDto: AddRiderDTO): Promise<Rider> {
    const { riderName } = addRiderDto;
    const exists = await this.checkIfRiderExists(riderName);
    if (exists) {
      throw new ConflictException('Rider with that name already exists');
    }
    const rider = new Rider();
    rider.riderName = riderName;
    return await this.riderRepository.save(rider);
  }

  async update(id: string, addRiderDto: AddRiderDTO): Promise<Rider> {
    const { riderName } = addRiderDto;
    const rider = await this.riderRepository.findOne({
      where: { id },
    });
    rider.riderName = riderName;
    return await this.riderRepository.save(rider);
  }

  async delete(id: string): Promise<void> {
    await this.riderRepository.delete(id);
  }
}
