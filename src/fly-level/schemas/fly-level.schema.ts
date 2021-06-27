import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Document } from 'mongoose';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPositive,
  IsInt,
} from 'class-validator';

@Schema()
export class FlyLevel {
  @Prop()
  @ApiProperty({ description: 'Значение уровня сложности' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  speed: number;

  @Prop()
  @ApiProperty({ description: 'Описание уровня сложности' })
  @IsNotEmpty()
  @IsString()
  caption: string;
}

export class FlyLevelDocument extends IntersectionType(FlyLevel, Document) {}

export const FlyLevelSchema = SchemaFactory.createForClass(FlyLevel);
