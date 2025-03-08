import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ChatGateway, PrismaService, UserService],
})
export class GatewayModule {}
