import { ApiProperty } from '@nestjs/swagger';

import { UserResponseInterface } from '../types/userResponse.interface';

class UserDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  token: string;
  @ApiProperty()
  admin: boolean;
}

export class ResponseUserDto implements UserResponseInterface {
  @ApiProperty()
  user: UserDto;
}
