import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FlyRecords, FlyRecordsSchema } from './schemas/fly-records.schema';
import { FlyRecordsService } from './fly-records.service';
import { FlyRecordsController } from './fly-records.controller';

@Module({
  controllers: [FlyRecordsController],
  imports: [
    MongooseModule.forFeature([
      { name: FlyRecords.name, schema: FlyRecordsSchema },
    ]),
  ],
  providers: [FlyRecordsService],
  exports: [FlyRecordsService],
})
export class FlyRecordsModule {}
