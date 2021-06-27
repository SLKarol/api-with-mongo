import { ApiProperty } from '@nestjs/swagger';
import { FlyLevel } from '../schemas/fly-level.schema';

export class MainCrUpFlyLevelDtoDto {
  @ApiProperty()
  readonly level: FlyLevel;
}
