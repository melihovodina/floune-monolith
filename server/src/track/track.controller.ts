import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors} from "@nestjs/common";
import {TrackService} from "./track.service";
import {CreateTrackDto} from "./dto/create-track.dto";
import {ObjectId} from "mongoose";
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import { AuthGuard } from "src/utils/guards/auth.guard";
import { RoleGuard } from "src/utils/guards/role.guard";
import { Roles } from "src/utils/decorators/role.decorator";
import { TracksSortBy } from "src/utils/types";
import { UpdateTrackDto } from "./dto/update-track.dto";

@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

//user requests
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'picture', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]))
  @UseGuards(AuthGuard)
  create(@Req() req, @UploadedFiles() files, @Body() dto: CreateTrackDto) {
    const userId = req.user.id;
    const userName = req.user.name;
    const {audio, picture} = files
    return this.trackService.create(dto, userId, userName, audio[0], picture[0],);
  }

  @Get()
  getAll(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Query('sortBy') sortBy: TracksSortBy = 'createdAt'
  ) {
    return this.trackService.getAll(count, offset, sortBy);
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.trackService.search(query)
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id);
  }

  @Post('/by-ids')
  async getTracksByIds(@Body('ids') ids: string[]) {
    return this.trackService.getTracksByIds(ids);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(AuthGuard)
  async update(
    @Req() req,
    @Param('id') id: ObjectId,
    @Body() updateTrackDto: UpdateTrackDto,
    @UploadedFile() picture?
  ) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.trackService.update(id, updateTrackDto, userId, userRole, picture);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Req() req, @Param('id') id: ObjectId) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.trackService.delete(id, userId, userRole);
  }

  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id);
  }

//admin requests
  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles('admin')
  deleteAdmin(@Req() req, @Param('id') id: ObjectId, @Query('userId') userId: string,) {
    const userRole = req.user.role;
    return this.trackService.delete(id, userId, userRole);
  }
}
