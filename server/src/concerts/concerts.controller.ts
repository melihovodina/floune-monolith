import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UploadedFile, UseInterceptors, ForbiddenException, Query } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleGuard } from 'src/utils/guards/role.guard';
import { Roles } from 'src/utils/decorators/role.decorator';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(RoleGuard)
  @Roles('artist', 'admin')
  async create(
    @Req() req,
    @Body() createConcertDto: CreateConcertDto,
    @UploadedFile() picture?
  ) {
    if (req.user.role === 'artist') {
      createConcertDto.artist = req.user._id;
    }
    return this.concertsService.create(createConcertDto, picture);
  }

  @Get()
  findAll() {
    return this.concertsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.concertsService.findOne(id);
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.concertsService.search(query);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Roles('artist', 'admin')
  @UseInterceptors(FileInterceptor('picture'))
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateConcertDto: UpdateConcertDto,
    @UploadedFile() picture?
  ) {
    const concert = await this.concertsService.findOne(id);
    if (req.user.role === 'artist' && String(concert.artist) !== String(req.user._id)) {
      throw new ForbiddenException('You can update only your own concerts');
    }
    return this.concertsService.update(id, updateConcertDto, picture);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles('artist', 'admin')
  async remove(@Req() req, @Param('id') id: string) {
    const concert = await this.concertsService.findOne(id);
    if (req.user.role === 'artist' && String(concert.artist) !== String(req.user._id)) {
      throw new ForbiddenException('You can remove only your own concerts');
    }
    return this.concertsService.remove(id);
  }
}