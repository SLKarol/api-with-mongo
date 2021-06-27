import { ApiProperty } from '@nestjs/swagger';

import { FlyLevelDocument } from '../schemas/fly-level.schema';

export class ListFlyLevelDto {
  @ApiProperty({ type: [FlyLevelDocument] })
  readonly levels: FlyLevelDocument[];
}

export class ResponseFlyLevelDto {
  @ApiProperty({ type: FlyLevelDocument })
  readonly level: FlyLevelDocument;
}
