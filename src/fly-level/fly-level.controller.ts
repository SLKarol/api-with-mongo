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
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

import { ListFlyLevelDto, ResponseFlyLevelDto } from './dto/flyLevel.dto';
import { FlyLevelService } from './fly-level.service';
import { FlyLevel, FlyLevelDocument } from './schemas/fly-level.schema';

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
    return { levels };
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: ResponseFlyLevelDto })
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
    return { level };
  }
}
