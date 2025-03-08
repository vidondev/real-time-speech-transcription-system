import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    return user;
  }
  async findAllMessages() {
    const messages = await this.prisma.message.findMany({
      include: {
        user: true,
      },
    });
    return messages;
  }
}
