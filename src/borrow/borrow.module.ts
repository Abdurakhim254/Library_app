import { Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { PrismaService } from 'src/prisma';

@Module({
  controllers: [BorrowController],
  providers: [BorrowService, PrismaService],
})
export class BorrowModule {}
