import { IdDto } from '@app/dto/id.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';

import { FlyLevel } from '../schemas/fly-level.schema';

export class UpdateFlyLevelDtoDto extends IntersectionType(FlyLevel, IdDto) {}

export class MainUpdateFlyLevelDtoDto {
  @ApiProperty()
  level: UpdateFlyLevelDtoDto;
}
