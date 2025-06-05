import { IsMongoId, IsInt, Min, IsPositive, IsOptional, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsMongoId()
  concertId: string;

  @IsDateString()
  date: string;

  @IsInt()
  @Min(1)
  ticketsQuantity: number;

  @IsPositive()
  totalPrice: number;
}