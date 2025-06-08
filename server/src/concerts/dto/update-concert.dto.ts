import { PartialType } from '@nestjs/mapped-types';
import { CreateConcertDto } from './create-concert.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateConcertDto extends PartialType(CreateConcertDto) {
  @IsOptional()
  @IsBoolean()
  removePicture?: boolean;
}
