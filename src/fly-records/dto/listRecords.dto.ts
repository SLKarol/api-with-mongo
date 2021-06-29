import { ApiProperty } from '@nestjs/swagger';

import { UpdateFlyLevelDtoDto } from '@app/fly-level/dto/updateFlyLevel.dto';

class RecordsDto {
  @ApiProperty({ description: 'Максимальный результат' })
  'score': number;

  @ApiProperty({ description: 'Пользователь' })
  'userName': string;

  @ApiProperty({ description: 'Дата-время записи рекорда' })
  'updatedAt': string;
}

export class RecordByLevelDto {
  @ApiProperty({ description: 'По какому уровню сложности собран отчёт' })
  _id: UpdateFlyLevelDtoDto;

  @ApiProperty({ type: [RecordsDto] })
  records: RecordsDto[];
}
