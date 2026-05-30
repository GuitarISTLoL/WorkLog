import { Module } from '@nestjs/common';
import { WorkTypeService } from './work-type.service';
import { WorkTypeController } from './work-type.controller';
import { WorkTypeEntity } from './entities/work-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([WorkTypeEntity])],
  controllers: [WorkTypeController],
  providers: [WorkTypeService],
})
export class WorkTypeModule {}
