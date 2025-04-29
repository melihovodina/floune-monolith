import { Controller, Get, Post, Body, Param, Delete, UploadedFile, UseInterceptors, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  create(@UploadedFile() picture, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, picture);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('/name/:name')
  findByName(@Param('name') name: string) {
    return this.usersService.findByName(name);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('picture'))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() picture?
  ) {
    return this.usersService.update(id, updateUserDto, picture);
  }

  @Patch('/ban/:id')
  banUser(@Param('id') id: string) {
    return this.usersService.banUser(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
