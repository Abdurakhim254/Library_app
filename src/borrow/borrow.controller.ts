import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';

@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  borrowBook(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowService.borrowBook(createBorrowDto);
  }

  @Post('return/:id')
  returnBook(@Param('id', ParseIntPipe) id: number) {
    return this.borrowService.returnBook(id);
  }

  @Get('borrowed')
  getBorrowedBooks() {
    return this.borrowService.getBorrowedBooks();
  }
}
