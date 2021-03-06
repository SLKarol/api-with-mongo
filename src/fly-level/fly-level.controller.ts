import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
  Get,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

import { User } from '@app/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { ACCESS_DENIED } from '@app/consts/messages';

import { MainCreateFlyLevelDtoDto } from './dto/createFlyLevel.dto';
import { ListFlyLevelDto, ResponseFlyLevelDto } from './dto/flyLevel.dto';
import {
  MainUpdateFlyLevelDtoDto,
  UpdateFlyLevelDtoDto,
} from './dto/updateFlyLevel.dto';
import { FlyLevelService } from './fly-level.service';
import { FlyLevel } from './schemas/fly-level.schema';
import { FlyRecordsService } from '@app/fly-records/fly-records.service';

@Controller('fly-level')
export class FlyLevelController {
  constructor(
    private readonly flyLevelService: FlyLevelService,
    private readonly flyRecordsService: FlyRecordsService,
  ) {}
  @Get()
  @ApiResponse({
    description: 'Список уровней игры',
    type: ListFlyLevelDto,
    status: 200,
  })
  async getFlyLevels(): Promise<ListFlyLevelDto> {
    const levels = await this.flyLevelService.findAll();
    return this.flyLevelService.buildListFlyLevelResponse(levels);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: MainCreateFlyLevelDtoDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    description: 'Зарегестрированный уровень',
    status: 200,
    type: ResponseFlyLevelDto,
  })
  async createFlyLevel(
    @Body('level') createLevelDto: FlyLevel,
    @User('admin') isAdmin: boolean,
  ): Promise<ResponseFlyLevelDto> {
    if (!isAdmin)
      throw new HttpException(ACCESS_DENIED, HttpStatus.UNPROCESSABLE_ENTITY);
    const level = await this.flyLevelService.createFlyLevel(createLevelDto);
    return this.flyLevelService.buildFlyLevelResponse(level);
  }

  @Put()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: MainUpdateFlyLevelDtoDto })
  @ApiResponse({
    description: 'Обновлённый уровень',
    status: 200,
    type: ResponseFlyLevelDto,
  })
  @ApiBearerAuth()
  async updateFlyLevel(
    @Body('level') updateLevelDto: UpdateFlyLevelDtoDto,
    @User('admin') isAdmin: boolean,
  ): Promise<ResponseFlyLevelDto> {
    if (!isAdmin)
      throw new HttpException(ACCESS_DENIED, HttpStatus.UNPROCESSABLE_ENTITY);
    const level = await this.flyLevelService.updateLevel(updateLevelDto);
    return this.flyLevelService.buildFlyLevelResponse(level);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: null,
  })
  async deleteFlyLevel(
    @Param('id') id: string,
    @User('admin') isAdmin: boolean,
  ): Promise<null> {
    if (!isAdmin)
      throw new HttpException(ACCESS_DENIED, HttpStatus.UNPROCESSABLE_ENTITY);
    // Удаление всех очков этого уровня
    await this.flyRecordsService.deleteByLevelId(id);
    await this.flyLevelService.deleteFlyLevel(id);
    return null;
  }
}
