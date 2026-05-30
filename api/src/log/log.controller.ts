import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { LogService } from './log.service';
import { LogDto } from './dto/log.dto';
import { GetLogsDto } from './dto/get-log.dto';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  create(@Body() LogDto: LogDto) {
    return this.logService.create(LogDto);
  }

  @Get()
  findAll(@Query() query: GetLogsDto) {
    return this.logService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() LogDto: LogDto) {
    return this.logService.update(id, LogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logService.remove(id);
  }
}
