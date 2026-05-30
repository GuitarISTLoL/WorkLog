import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class GetLogsDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  count: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page: number;

  @IsNotEmpty()
  order: 'ASC' | 'DESC';

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
