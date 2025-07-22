import { IsInt, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBorrowDto {
  @IsInt()
  userId: number;

  @IsInt()
  bookId: number;

  @Type(() => Date)
  @IsDate()
  borrowDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  returnDate?: Date;
}
