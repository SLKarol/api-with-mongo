import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Имя/логин пользователя' })
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'user@domain.com' })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}

export class MainCreateUserDto {
  @ApiProperty()
  readonly user: CreateUserDto;
}
