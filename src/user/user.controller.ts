import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { MongooseValidationExceptionFilter } from 'src/mongoose-exception.filter';

@Controller('user')
@UseFilters(MongooseValidationExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User has been registered successfully',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return await this.userService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Login success',
  })
  @ApiResponse({
    status: 403,
    description: 'Invalid email',
  })
  async login(@Body() loginDto: LoginUserDto) {
    const user = await this.userService.getByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid Email');
    }

    return user;
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'List of Users',
  })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
}
