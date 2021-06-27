import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IdDto {
  @ApiProperty({ description: 'Id документа' })
  @IsNotEmpty()
  @IsString()
  readonly _id: string;
}
