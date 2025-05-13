import { Controller, Get, Post, Body, Param, Delete, UploadedFile, UseInterceptors, Patch, UseGuards, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from "@nestjs/platform-express";
import { RoleGuard } from 'src/utils/guards/role.guard';
import { Roles } from 'src/utils/decorators/role.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { UsersSortBy } from 'src/utils/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

// users requests
  @Get()
  getAll(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Query('sortBy') sortBy: UsersSortBy = 'createdAt'
  ) {
    return this.usersService.getAll(count, offset, sortBy);
  }

  @Get('/name/:name')
  findByName(@Param('name') name: string) {
    return this.usersService.findByName(name);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req,) {
    const userId = req.user.id;
    return this.usersService.findOne(userId);
  }

  @Patch('/profile')
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(AuthGuard)
  updateProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() picture?
  ) {
    const userId = req.user.id;
    return this.usersService.update(userId, updateProfileDto, picture);
  }

  @Patch('/favorite/:trackId')
  @UseGuards(AuthGuard)
  async addTrackToFavorites(@Req() req, @Param('trackId') trackId: string) {
    const userId = req.user.id;
    return this.usersService.addTrackToFavorites(userId, trackId);
  }

  @Patch('/unfavorite/:trackId')
  @UseGuards(AuthGuard)
  async removeTrackFromFavorites(@Req() req, @Param('trackId') trackId: string) {
    const userId = req.user.id;
    return this.usersService.removeTrackFromFavorites(userId, trackId);
  }

// admin requests
  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(RoleGuard)
  @Roles('admin')
  create(@UploadedFile() picture, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, picture);
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(RoleGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() picture?
  ) {
    return this.usersService.update(id, updateUserDto, picture);
  }

  @Patch('/ban/:id')
  @UseGuards(RoleGuard)
  @Roles('admin')
  banUser(@Param('id') id: string) {
    return this.usersService.banUser(id);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}