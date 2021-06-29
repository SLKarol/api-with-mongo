import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WriteScroreDto {
  @ApiProperty({ description: 'Результат игры' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  readonly score: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Id уровня сложности' })
  readonly idLevel: string;
}

export class MainWriteScroreDto {
  @ApiProperty()
  readonly record: WriteScroreDto;
}
