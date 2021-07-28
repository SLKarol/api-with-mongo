import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
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

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Id уровня сложности' })
  readonly idLevel: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  @ApiProperty({ description: 'Скорость на выбранном уровне' })
  readonly speed: number;
}

export class MainWriteScroreDto {
  @ApiProperty()
  readonly record: WriteScroreDto;
}
