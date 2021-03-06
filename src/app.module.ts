import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { getMongoConfig } from './configs/mongo.config';
import { FlyLevelModule } from './fly-level/fly-level.module';
import { FlyRecordsModule } from './fly-records/fly-records.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    FlyLevelModule,
    FlyRecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
