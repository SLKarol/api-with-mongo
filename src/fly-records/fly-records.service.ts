import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RecordByLevelDto } from './dto/listRecords.dto';

import { WriteScroreDto } from './dto/writeRecord.dto';
import { FlyRecords, FlyRecordsDocument } from './schemas/fly-records.schema';
import {
  FlyLevel,
  FlyLevelDocument,
} from '@app/fly-level/schemas/fly-level.schema';

@Injectable()
export class FlyRecordsService {
  constructor(
    @InjectModel(FlyRecords.name)
    private readonly flyRecordsRepository: Model<FlyRecordsDocument>,
    @InjectModel(FlyLevel.name)
    private readonly flyLevelRepository: Model<FlyLevelDocument>,
  ) {}

  async sendRecord(
    idUser: string,
    writeScroreDto: WriteScroreDto,
  ): Promise<boolean> {
    const { idLevel = '', score, speed = 0 } = writeScroreDto;
    let id_level = idLevel;
    // Проверка на то, что дали рабочий уровень
    if (idLevel) {
      const level = await this.flyLevelRepository.findById(idLevel);
      if (!level) {
        throw new HttpException(
          'Уровень с заданным id не найден',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      id_level = level.id;
    }
    // Получить id уровня
    if (!idLevel) {
      const level = await this.flyLevelRepository.findOne({ speed });
      if (!level) {
        throw new HttpException(
          'Уровень с заданной скоростью не найден',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      id_level = level.id;
    }
    const existRecord = await this.flyRecordsRepository
      .findOne({
        id_level,
        id_user: idUser,
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
      id_level: Types.ObjectId(id_level),
      id_user: Types.ObjectId(idUser),
      score,
    });
    await newRecord.save();
    return true;
  }

  async getAllRecords(): Promise<RecordByLevelDto> {
    const re = await this.flyRecordsRepository
      .aggregate([
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
                updatedAt: '$updatedAt',
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
        id_level: id,
      })
      .exec();
    return !!existRecord;
  }

  /**
   * Удалить записи по ID уровня
   */
  async deleteByLevelId(id: string) {
    return await this.flyRecordsRepository.deleteMany({
      id_level: id,
    });
  }
}
