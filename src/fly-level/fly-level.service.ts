import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ListFlyLevelDto, ResponseFlyLevelDto } from './dto/flyLevel.dto';
import { UpdateFlyLevelDtoDto } from './dto/updateFlyLevel.dto';
import { FlyLevel, FlyLevelDocument } from './schemas/fly-level.schema';

@Injectable()
export class FlyLevelService {
  constructor(
    @InjectModel(FlyLevel.name)
    private readonly flyLevelRepository: Model<FlyLevelDocument>,
  ) {}

  async findAll(): Promise<FlyLevelDocument[]> {
    return this.flyLevelRepository.find().sort('speed').exec();
  }

  async createFlyLevel(createLevelDto: FlyLevel): Promise<FlyLevelDocument> {
    const newLevel = new this.flyLevelRepository(createLevelDto);
    return await newLevel.save();
  }

  buildFlyLevelResponse(level: FlyLevelDocument): ResponseFlyLevelDto {
    return { level };
  }

  buildListFlyLevelResponse(levels: FlyLevelDocument[]): ListFlyLevelDto {
    return { levels };
  }

  async updateLevel(
    updateLevelDto: UpdateFlyLevelDtoDto,
  ): Promise<FlyLevelDocument> {
    const level = await this.flyLevelRepository
      .findById(new Types.ObjectId(updateLevelDto._id))
      .exec();
    Object.assign(level, updateLevelDto);
    return await level.save();
  }

  async deleteFlyLevel(id: string) {
    this.flyLevelRepository.findByIdAndDelete(id).exec();
  }
}
