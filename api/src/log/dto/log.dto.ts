import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';
import {
  TEXT_WITH_PUNCTUATION_MESSAGE,
  TEXT_WITH_PUNCTUATION_PATTERN,
} from '../../common/text.validation';

export class LogDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @Matches(TEXT_WITH_PUNCTUATION_PATTERN, {
    message: `ФИО: ${TEXT_WITH_PUNCTUATION_MESSAGE}`,
  })
  user: string;

  @IsNotEmpty()
  @IsUUID()
  type: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  count: number;

  @IsOptional()
  @IsDateString()
  complitedAt: string;
}
