import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Document, Types, ObjectId } from 'mongoose';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsPositive,
  IsInt,
} from 'class-validator';

import { FlyLevel } from '@app/fly-level/schemas/fly-level.schema';
import { User } from '@app/auth/schemas/user.schema';

@Schema({ timestamps: true })
export class FlyRecords {
  @Prop()
  @ApiProperty({ description: 'Значение' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  score: number;

  @Prop({ type: Types.ObjectId, ref: FlyLevel.name, required: false })
  @ApiProperty({ description: 'Id уровня сложности' })
  @IsNotEmpty()
  @IsString()
  id_level: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: false })
  @ApiProperty({ description: 'Id Пользователя' })
  @IsNotEmpty()
  @IsString()
  id_user: Types.ObjectId;
}

export class FlyRecordsDocument extends IntersectionType(
  FlyRecords,
  Document,
) {}

export const FlyRecordsSchema = SchemaFactory.createForClass(FlyRecords);
