import { ApiProperty } from '@nestjs/swagger';
import { FlyLevel } from '../schemas/fly-level.schema';

export class MainCreateFlyLevelDtoDto {
  @ApiProperty()
  readonly level: FlyLevel;
}
