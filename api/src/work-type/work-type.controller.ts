import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { WorkTypeService } from './work-type.service';
import { WorkTypeDto } from './dto/work-type.dto';

@Controller('work-type')
export class WorkTypeController {
  constructor(private readonly workTypeService: WorkTypeService) {}

  @Post()
  create(@Body() WorkTypeDto: WorkTypeDto) {
    return this.workTypeService.create(WorkTypeDto);
  }

  @Get()
  findAll() {
    return this.workTypeService.findAll();
  }

  @Get('search')
  findByTitle(@Query('title') title: string) {
    return this.workTypeService.findByTitle(title);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workTypeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() WorkTypeDto: WorkTypeDto) {
    return this.workTypeService.update(id, WorkTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workTypeService.remove(id);
  }
}
