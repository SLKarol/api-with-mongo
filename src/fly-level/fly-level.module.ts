import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FlyRecordsModule } from '@app/fly-records/fly-records.module';
import { FlyLevelController } from './fly-level.controller';
import { FlyLevelService } from './fly-level.service';
import { FlyLevel, FlyLevelSchema } from './schemas/fly-level.schema';

@Module({
  controllers: [FlyLevelController],
  imports: [
    MongooseModule.forFeature([
      { name: FlyLevel.name, schema: FlyLevelSchema },
    ]),
    FlyRecordsModule,
  ],
  providers: [FlyLevelService],
})
export class FlyLevelModule {}
