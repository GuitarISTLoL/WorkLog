import { Injectable, NotFoundException, Param, Query } from '@nestjs/common';
import { LogDto } from './dto/log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';
import { Between, Repository } from 'typeorm';
import { WorkTypeEntity } from '../work-type/entities/work-type.entity';
import { GetLogsDto } from './dto/get-log.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly LogRepository: Repository<LogEntity>,
  ) {}

  async create(LogDto: LogDto) {
    const log = await this.LogRepository.create({
      user: LogDto.user,
      count: LogDto.count,
      type: {
        id: LogDto.type,
      } as WorkTypeEntity,
    });
    return await this.LogRepository.save(log);
  }

  async findAll(query: GetLogsDto) {
    const { count, page, order, dateFrom, dateTo } = query;

    const skip = count * (page - 1);

    const where: any = {};

    if (dateFrom && dateTo) {
      where.createdAt = Between(
        new Date(`${dateFrom}T00:00:00.000Z`),
        new Date(`${dateTo}T23:59:59.999Z`),
      );
    }

    return this.LogRepository.findAndCount({
      where,
      order: {
        createdAt: order,
      },
      skip,
      take: count,
      relations: {
        type: true,
      },
    });
  }

  async findOne(id: string) {
    const log = await this.LogRepository.findOne({ where: { id } });

    if (!log) throw new NotFoundException('Log not found');

    return log;
  }

  async update(id: string, LogDto: LogDto) {
    const log = await this.findOne(id);

    Object.assign(log, LogDto);
    return await this.LogRepository.save(log);
  }

  async remove(id: string) {
    const log = await this.findOne(id);
    await this.LogRepository.remove(log);
    return log.id;
  }
}
