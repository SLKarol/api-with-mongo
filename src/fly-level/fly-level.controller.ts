import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
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
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { MainCreateFlyLevelDtoDto } from './dto/createFlyLevel.dto';

import { ListFlyLevelDto, ResponseFlyLevelDto } from './dto/flyLevel.dto';
import {
  MainUpdateFlyLevelDtoDto,
  UpdateFlyLevelDtoDto,
} from './dto/updateFlyLevel.dto';
import { FlyLevelService } from './fly-level.service';
import { FlyLevel } from './schemas/fly-level.schema';

@Controller('fly-level')
export class FlyLevelController {
  constructor(private readonly flyService: FlyLevelService) {}
  @Get()
  @ApiResponse({
    description: 'Список уровней игры',
    type: ListFlyLevelDto,
    status: 200,
  })
  async getFlyLevels(): Promise<ListFlyLevelDto> {
    const levels = await this.flyService.findAll();
    return this.flyService.buildListFlyLevelResponse(levels);
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
  ): Promise<ResponseFlyLevelDto> {
    const level = await this.flyService.createFlyLevel(createLevelDto);
    return this.flyService.buildFlyLevelResponse(level);
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
  ): Promise<ResponseFlyLevelDto> {
    const level = await this.flyService.updateLevel(updateLevelDto);
    return this.flyService.buildFlyLevelResponse(level);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: null,
  })
  async deleteFlyLevel(@Param('id') id: string): Promise<null> {
    await this.flyService.deleteFlyLevel(id);
    return null;
  }
}
