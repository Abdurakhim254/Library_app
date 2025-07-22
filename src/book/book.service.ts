import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: createBookDto,
    });
  }

  async findAll() {
    return this.prisma.book.findMany();
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const existing = await this.prisma.book.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Book not found`);
    }

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.book.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Book not found`);
    }

    return this.prisma.book.delete({
      where: { id },
    });
  }
}
