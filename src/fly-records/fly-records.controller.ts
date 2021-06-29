import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

import { User } from '@app/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { ACCESS_DENIED } from '@app/consts/messages';

import { FlyRecordsService } from './fly-records.service';
import { MainWriteScroreDto, WriteScroreDto } from './dto/writeRecord.dto';
import { RecordByLevelDto } from './dto/listRecords.dto';

@Controller('fly-records')
export class FlyRecordsController {
  constructor(
    private readonly flyRecordsService: FlyRecordsService, // private readonly flyLevelService: FlyLevelService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: MainWriteScroreDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    description: 'Зарегестрирован результат?',
    status: 200,
    type: Boolean,
  })
  async writeRecord(
    @User('id') idUser: string,
    @Body('record') writeScroreDto: WriteScroreDto,
  ): Promise<boolean> {
    if (!idUser)
      throw new HttpException(ACCESS_DENIED, HttpStatus.UNPROCESSABLE_ENTITY);
    const record = await this.flyRecordsService.sendRecord(
      idUser,
      writeScroreDto,
    );
    return record;
  }

  @Get()
  @ApiResponse({
    description: 'Отчёт по результатам игры',
    type: [RecordByLevelDto],
    status: 200,
  })
  async getAllRecords(): Promise<RecordByLevelDto> {
    return this.flyRecordsService.getAllRecords();
  }
}
