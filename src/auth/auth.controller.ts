import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, MainCreateUserDto } from './dto/createUser.dto';
import { LoginUserDto, MainLoginDto } from './dto/loginUser.dto';
import { User } from './decorators/user.decorator';
import { MainUpdateUserDto, UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ResponseUserDto } from './dto/responseUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  @ApiBody({ type: MainCreateUserDto })
  @ApiResponse({
    description: 'Зарегестрированный пользователь',
    status: 200,
    type: ResponseUserDto,
  })
  async register(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    const user = await this.authService.createUser(createUserDto);
    return this.authService.buildUserResponse(user);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  @ApiBody({ type: MainLoginDto })
  @ApiResponse({
    description: 'Успешно залогинился юзер',
    status: 200,
    type: ResponseUserDto,
  })
  async login(@Body('user') loginDto: LoginUserDto): Promise<ResponseUserDto> {
    const user = await this.authService.login(loginDto);
    return this.authService.buildUserResponse(user);
  }

  @Put('user')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: MainUpdateUserDto })
  @ApiResponse({
    description: 'Обновлённый пользователь',
    status: 200,
    type: ResponseUserDto,
  })
  @ApiBearerAuth()
  async updateCurrentUser(
    @User('id') currentUserId: string,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const user = await this.authService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.authService.buildUserResponse(user);
  }
}
