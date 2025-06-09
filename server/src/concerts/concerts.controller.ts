import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UploadedFile, UseInterceptors, ForbiddenException, Query, UploadedFiles } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { RoleGuard } from 'src/utils/guards/role.guard';
import { Roles } from 'src/utils/decorators/role.decorator';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 2))
  @UseGuards(RoleGuard)
  @Roles('artist', 'admin')
  async create(
    @Req() req,
    @Body() createConcertDto: CreateConcertDto,
    @UploadedFiles() files
  ) {
    if (req.user.role === 'artist' || !createConcertDto.artist) {
      createConcertDto.artist = req.user.id;
      console.log('Artist ID set to:', createConcertDto.artist);
    }

    const picture = files?.[0];
    const scheme = files?.[1];

    return this.concertsService.create(createConcertDto, picture, scheme);
  }

  @Get()
  findAll(@Query('new') isNew?: string) {
    return this.concertsService.findAll(isNew === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.concertsService.findOne(id);
  }

  @Post('/by-ids')
  async findByIds(@Body('ids') ids: string[]) {
    return this.concertsService.findByIds(ids);
  }

  @Get('/search')
  search(@Query('query') query: string) {
    return this.concertsService.search(query);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Roles('artist', 'admin')
  @UseInterceptors(FilesInterceptor('files', 2))
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateConcertDto: UpdateConcertDto,
    @UploadedFiles() files
  ) {
    const picture = files?.[0];
    const scheme = files?.[1];
    return this.concertsService.update(id, updateConcertDto, picture, scheme);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles('artist', 'admin')
  async remove(@Req() req, @Param('id') id: string) {
    return this.concertsService.remove(id);
  }
}