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
  @UseGuards(AuthGuard)
  getAll(
    @Req() req,
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Query('sortBy') sortBy: UsersSortBy = 'createdAt',
    @Query('full') full: string
  ) {
    const isAdmin = req.user?.role === 'admin';
    const needFull = isAdmin && full === 'true';
    return this.usersService.getAll(count, offset, sortBy, needFull);
  }

  @Get('/name/:name')
  @UseGuards(AuthGuard)
  findByName(@Req() req, @Param('name') name: string, @Query('full') full: string) {
    const isAdmin = req.user?.role === 'admin';
    const needFull = isAdmin && full === 'true';
    return this.usersService.findOne('name', name, needFull);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req, @Query('full') full: string) {
    const userId = req.user.id;
    const isAdmin = req.user?.role === 'admin';
    const needFull = isAdmin && full === 'true';
    return this.usersService.findOne('id', userId, needFull);
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
    return this.usersService.toggleTrackFavorite(userId, trackId, true);
  }

  @Patch('/unfavorite/:trackId')
  @UseGuards(AuthGuard)
  async removeTrackFromFavorites(@Req() req, @Param('trackId') trackId: string) {
    const userId = req.user.id;
    return this.usersService.toggleTrackFavorite(userId, trackId);
  }

  @Patch('/follow/:targetUserId')
  @UseGuards(AuthGuard)
  async followUser(@Req() req, @Param('targetUserId') targetUserId: string) {
    const currentUserId = req.user.id;
    return this.usersService.toggleUserFollows(currentUserId, targetUserId, true);
  }

  @Patch('/unfollow/:targetUserId')
  @UseGuards(AuthGuard)
  async unfollowUser(@Req() req, @Param('targetUserId') targetUserId: string) {
    const currentUserId = req.user.id;
    return this.usersService.toggleUserFollows(currentUserId, targetUserId);
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
    return this.usersService.findOne('id', id, true);
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
    return this.usersService.update(id, updateUserDto, picture, true);
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