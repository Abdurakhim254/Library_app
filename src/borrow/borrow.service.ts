import { Injectable } from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';

@Injectable()
export class BorrowService {
  async borrowBook(createBorrowDto: CreateBorrowDto) {}

  async returnBook(id: number) {}

  async getBorrowedBooks() {}
}
