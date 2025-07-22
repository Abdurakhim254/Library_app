import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { BorrowModule } from './borrow/borrow.module';

@Module({
  imports: [UserModule, BookModule, BorrowModule],
})
export class AppModule {}
