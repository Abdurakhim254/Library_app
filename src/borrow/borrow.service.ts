import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateBorrowDto } from './dto/create-borrow.dto';

@Injectable()
export class BorrowService {
  private readonly logger = new Logger(BorrowService.name);

  constructor(private readonly prisma: PrismaService) {}

  async borrowBook(createBorrowDto: CreateBorrowDto) {
    const { userId, bookId } = createBorrowDto;

    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Kitob topilmadi');
    if (!book.isAvailable) throw new ConflictException('Kitob hozirda mavjud emas');

    const borrow = await this.prisma.borrow.create({
      data: {
        userId,
        bookId,
        borrowDate: new Date(),
      },
    });

    await this.prisma.book.update({
      where: { id: bookId },
      data: { isAvailable: false },
    });

    this.logger.log(`Kitob ID ${bookId} foydalanuvchi ID ${userId} tomonidan ijaraga olindi`);
    return borrow;
  }

  async returnBook(borrowId: number) {
    const borrow = await this.prisma.borrow.findUnique({ where: { id: borrowId } });
    if (!borrow) throw new NotFoundException('Ijara yozuvi topilmadi');
    if (borrow.returnDate) throw new ConflictException('Bu kitob allaqachon qaytarilgan');

    const updatedBorrow = await this.prisma.borrow.update({
      where: { id: borrowId },
      data: {
        returnDate: new Date(),
      },
    });

    await this.prisma.book.update({
      where: { id: borrow.bookId },
      data: { isAvailable: true },
    });

    this.logger.log(`Kitob ID ${borrow.bookId} (Borrow ID ${borrowId}) qaytarildi`);
    return updatedBorrow;
  }

  async getBorrowedBooks() {
    return this.prisma.borrow.findMany({
      where: {
        returnDate: null,
      },
      include: {
        book: true,
        user: true,
      },
    });
  }
}
