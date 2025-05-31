import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean()
  @IsOptional()
  banned?: boolean;

  @IsArray()
  @IsOptional()
  likedTracks?: ObjectId[];

  @IsArray()
  @IsOptional()
  uploadedTracks?: ObjectId[];
  
  @IsOptional()
  @IsBoolean()
  removePicture?: boolean;
}
