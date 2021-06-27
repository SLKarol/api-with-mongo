import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../schemas/user.schema';

export class LoginUserDto extends User {
  @ApiProperty({ description: 'Адрес почты юзера' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'Пароль' })
  @IsNotEmpty()
  readonly password: string;
}

export class MainLoginDto {
  @ApiProperty()
  readonly user: LoginUserDto;
}
