import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  TEXT_WITH_PUNCTUATION_MESSAGE,
  TEXT_WITH_PUNCTUATION_PATTERN,
} from '../../common/text.validation';

export type UnitType = 'm' | 'm2' | 'unit' | 'м' | 'м2' | 'ед';
export const UNIT_TYPES: UnitType[] = ['m', 'm2', 'unit', 'м', 'м2', 'ед'];
export class WorkTypeDto {
  @IsNotEmpty()
  @IsString()
  @Matches(TEXT_WITH_PUNCTUATION_PATTERN, {
    message: `Наименование работы: ${TEXT_WITH_PUNCTUATION_MESSAGE}`,
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(UNIT_TYPES)
  unit: UnitType;
}
