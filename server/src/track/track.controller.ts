import {Body, Controller, Delete, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors} from "@nestjs/common";
import {TrackService} from "./track.service";
import {CreateTrackDto} from "./dto/create-track.dto";
import {ObjectId} from "mongoose";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import { AuthGuard } from "src/utils/guards/auth.guard";

@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

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
  getAll(@Query('count') count: number,
  @Query('offset') offset: number) {
    return this.trackService.getAll(count, offset)
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.trackService.search(query)
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id);
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
}
