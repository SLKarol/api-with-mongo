import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.authService.createUser(createUserDto);
    return this.authService.buildUserResponse(user);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body('user') loginDto: LoginUserDto) {
    const user = await this.authService.login(loginDto);
    return this.authService.buildUserResponse(user);
  }
}
