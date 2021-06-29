import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { WriteScroreDto } from './dto/writeRecord.dto';
import { FlyRecords, FlyRecordsDocument } from './schemas/fly-records.schema';

@Injectable()
export class FlyRecordsService {
  constructor(
    @InjectModel(FlyRecords.name)
    private readonly flyRecordsRepository: Model<FlyRecordsDocument>,
  ) {}

  async sendRecord(
    idUser: string,
    writeScroreDto: WriteScroreDto,
  ): Promise<boolean> {
    const { idLevel, score } = writeScroreDto;
    const existRecord = await this.flyRecordsRepository
      .findOne({
        id_level: new Types.ObjectId(idLevel),
        id_user: new Types.ObjectId(idUser),
      })
      .exec();
    // Если запись существует и очки в этой записи больше, то не делать ничего
    if (existRecord && existRecord.score >= score) return false;
    // Если запись существует, но очки меньше, то обновить запись об очках
    if (existRecord) {
      existRecord.score = score;
      await existRecord.save();
      return true;
    }
    // Создать новую запись
    const newRecord = new this.flyRecordsRepository({
      id_level: Types.ObjectId(idLevel),
      id_user: Types.ObjectId(idUser),
      score,
    });
    await newRecord.save();
    return true;
  }

  async getAllRecords(): Promise<any> {
    const re = await this.flyRecordsRepository
      .aggregate<any[]>([
        // Сортировка очков по убыванию
        { $sort: { score: -1 } },
        {
          $lookup: {
            from: 'flylevels',
            localField: 'id_level',
            foreignField: '_id',
            as: 'levels',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'id_user',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $addFields: {
            levelCaption: { $first: '$levels.caption' },
            levelSpeed: { $first: '$levels.speed' },
            userName: { $first: '$users.username' },
          },
        },
        {
          $group: {
            _id: {
              _id: '$id_level',
              caption: '$levelCaption',
              speed: '$levelSpeed',
            },
            records: {
              $push: {
                score: '$score',
                userName: '$userName',
              },
            },
          },
        },
        // Отсортировать результат по скоростям
        { $sort: { '_id.speed': -1 } },
      ])
      .exec();
    return re;
  }

  async findByLevelId(id: string): Promise<boolean> {
    const existRecord = await this.flyRecordsRepository
      .findOne({
        id_level: new Types.ObjectId(id),
      })
      .exec();
    return !!existRecord;
  }
}
