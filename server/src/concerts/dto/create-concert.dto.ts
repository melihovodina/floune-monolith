import { IsMongoId, IsString, IsDateString, IsInt, Min, IsPositive, IsOptional, IsBoolean } from 'class-validator';

export class CreateConcertDto {
  @IsOptional()
  @IsMongoId()
  artist: string;

  @IsString()
  city: string;

  @IsString()
  venue: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  ticketsQuantity: number;

  @IsPositive()
  ticketPrice: number;
}