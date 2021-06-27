import { IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';
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

  @IsBoolean()
  @ApiProperty({
    default: false,
    description: 'Регистрировать как администратора?',
  })
  readonly admin: boolean = false;
}

export class MainCreateUserDto {
  @ApiProperty()
  readonly user: CreateUserDto;
}
