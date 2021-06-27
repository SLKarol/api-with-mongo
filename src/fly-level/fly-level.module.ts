import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FlyLevelController } from './fly-level.controller';
import { FlyLevelService } from './fly-level.service';
import { FlyLevel, FlyLevelSchema } from './schemas/fly-level.schema';

@Module({
  controllers: [FlyLevelController],
  imports: [
    MongooseModule.forFeature([
      { name: FlyLevel.name, schema: FlyLevelSchema },
    ]),
  ],
  providers: [FlyLevelService],
})
export class FlyLevelModule {}
