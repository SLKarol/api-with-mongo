import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FlyRecords, FlyRecordsSchema } from './schemas/fly-records.schema';
import { FlyRecordsService } from './fly-records.service';
import { FlyRecordsController } from './fly-records.controller';
import {
  FlyLevel,
  FlyLevelSchema,
} from '@app/fly-level/schemas/fly-level.schema';

@Module({
  controllers: [FlyRecordsController],
  imports: [
    MongooseModule.forFeature([
      { name: FlyRecords.name, schema: FlyRecordsSchema },
      { name: FlyLevel.name, schema: FlyLevelSchema },
    ]),
  ],
  providers: [FlyRecordsService],
  exports: [FlyRecordsService],
})
export class FlyRecordsModule {}
