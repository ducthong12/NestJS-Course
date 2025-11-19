import { Module } from '@nestjs/common';
import { PraticePrismaService } from './pratice_prisma.service';
import { PraticePrismaController } from './pratice_prisma.controller';
import { PrismaService } from 'src/config/prisma.service';

@Module({
  controllers: [PraticePrismaController],
  providers: [PraticePrismaService, PrismaService],
})
export class PraticePrismaModule {}
