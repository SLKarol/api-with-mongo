import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { hash, compare } from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/createUser.dto';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ResponseUserDto } from './dto/responseUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userRepository: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const userByEmail = await this.findUser(createUserDto.email);
    const userByName = await this.userRepository.findOne({
      username: createUserDto.username,
    });
    if (userByName || userByEmail) {
      throw new HttpException(
        'Email or username a taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new this.userRepository(createUserDto);
    newUser.password = await hash(createUserDto.password, 10);
    newUser.admin = 'admin' in createUserDto ? createUserDto.admin : false;
    return await newUser.save();
  }

  private async findUser(email: string) {
    return this.userRepository.findOne({ email });
  }

  // ? Вероятно не нужен
  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<User, 'email'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return { email: user.email };
  }

  generateJwt(user: UserDocument): string {
    const { _id } = user;
    return this.jwtService.sign(
      { id: _id },
      { secret: this.configService.get<string>('JWT_SECRET') },
    );
  }

  buildUserResponse(user: UserDocument): ResponseUserDto {
    const { username, email, admin } = user;
    return {
      user: {
        username,
        email,
        token: this.generateJwt(user),
        admin,
      },
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<UserDocument> {
    const user = await this.userRepository
      .findOne({
        email: loginUserDto.email,
      })
      .exec();
    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository
      .findById(new Types.ObjectId(userId))
      .exec();
    Object.assign(user, updateUserDto);
    return await user.save();
  }
}
