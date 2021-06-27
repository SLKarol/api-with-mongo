import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FlyLevel, FlyLevelDocument } from './schemas/fly-level.schema';

@Injectable()
export class FlyLevelService {
  constructor(
    @InjectModel(FlyLevel.name)
    private readonly flyLevelRepository: Model<FlyLevelDocument>,
  ) {}

  async findAll(): Promise<FlyLevelDocument[]> {
    return this.flyLevelRepository.find().exec();
  }

  async createFlyLevel(createLevelDto: FlyLevel): Promise<FlyLevelDocument> {
    const newLevel = new this.flyLevelRepository(createLevelDto);
    return await newLevel.save();
  }
}
