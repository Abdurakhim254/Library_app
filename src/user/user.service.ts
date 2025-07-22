import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('Email is  already in use');
    }

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email is already in use');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async getUserBorrowHistory(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        borrows: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      history: user.borrows.map((borrow) => ({
        bookId: borrow.book.id,
        title: borrow.book.title,
        borrowDate: borrow.borrowDate,
        returnDate: borrow.returnDate,
      })),
    };
  }
  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
