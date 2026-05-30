import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkTypeDto } from './dto/work-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { WorkTypeEntity } from './entities/work-type.entity';

@Injectable()
export class WorkTypeService {
  constructor(
    @InjectRepository(WorkTypeEntity)
    private readonly WorkTypeRepository: Repository<WorkTypeEntity>,
  ) {}

  async create(WorkTypeDto: WorkTypeDto): Promise<WorkTypeEntity> {
    const workType = await this.WorkTypeRepository.create(WorkTypeDto);
    return await this.WorkTypeRepository.save(workType);
  }

  async findAll(): Promise<WorkTypeEntity[]> {
    return await this.WorkTypeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByTitle(title: string): Promise<WorkTypeEntity[]> {
    return await this.WorkTypeRepository.find({
      where: title ? { title: ILike(`%${title}%`) } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<WorkTypeEntity> {
    const workType = await this.WorkTypeRepository.findOne({ where: { id } });

    if (!workType) throw new NotFoundException('Work type not found');

    return workType;
  }

  async update(id: string, WorkTypeDto: WorkTypeDto): Promise<WorkTypeEntity> {
    const workType = await this.findOne(id);

    Object.assign(workType, WorkTypeDto);
    return await this.WorkTypeRepository.save(workType);
  }

  async remove(id: string): Promise<string> {
    const workType = await this.findOne(id);
    await this.WorkTypeRepository.remove(workType);
    return workType.id;
  }
}
