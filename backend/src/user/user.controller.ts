import { Post, Body, Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('messages')
  messages() {
    return this.userService.findAllMessages();
  }
  @Post('login')
  async create(@Body() createUserDto: CreateUserDto) {
    const existUser = await this.userService.findOne(createUserDto.email);
    if (existUser) {
      return existUser;
    }

    return this.userService.create(createUserDto);
  }
}
