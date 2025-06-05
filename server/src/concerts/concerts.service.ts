import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Concert, ConcertDocument } from './entities/concert.entity';
import { Model } from 'mongoose';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { FileService, FileType } from '../file/file.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectModel(Concert.name) private concertModel: Model<ConcertDocument>,
    private fileService: FileService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  async create(createConcertDto: CreateConcertDto, picture?) {
    let picturePath: string | undefined;
    if (picture) {
      const pictureResult = await this.fileService.createFile(FileType.IMAGE, picture);
      picturePath = pictureResult.path;
    }

    const concert = await this.concertModel.create({
      ...createConcertDto,
      picturePath,
    });

    await this.usersService.toggleConcertInUser(createConcertDto.artist, concert._id.toString(), true);

    return concert;
  }

  async findAll() {
    return this.concertModel.find().populate('artist', '_id name picture').lean();
  }

  async findOne(id: string) {
    const concert = await this.concertModel.findById(id).populate('artist', '_id name picture').lean();
    if (!concert) {
      throw new BadRequestException(`Concert with id ${id} not found`);
    }
    return concert;
  }

  async search(query: string) {
    const concerts = await this.concertModel.find({
      $or: [
        { city: { $regex: new RegExp(query, 'i') } },
        { artistName: { $regex: new RegExp(query, 'i') } }
      ]
    }).populate('artist', '_id name picture').lean();
    return concerts;
  }


  async update(id: string, updateConcertDto: UpdateConcertDto, picture?) {
    const concert = await this.concertModel.findById(id);
    if (!concert) {
      throw new BadRequestException(`Concert with id ${id} not found`);
    }

    let picturePath: string | undefined = concert.picturePath;

    if ((updateConcertDto as any).removePicture) {
      if (concert.picturePath) {
        await this.fileService.removeFile(concert.picturePath);
      }
      picturePath = undefined;
    }

    if (picture) {
      if (concert.picturePath) {
        await this.fileService.removeFile(concert.picturePath);
      }
      const pictureResult = await this.fileService.createFile(FileType.IMAGE, picture);
      picturePath = pictureResult.path;
    }

    let updateQuery: any = { ...updateConcertDto };
    if (typeof picturePath !== 'undefined') {
      updateQuery.picturePath = picturePath;
    }
    if ((updateConcertDto as any).removePicture) {
      updateQuery.$unset = { picturePath: 1 };
      delete updateQuery.picturePath;
    }

    const updated = await this.concertModel.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true }
    ).lean();

    return updated;
  }

  async remove(id: string) {
    const concert = await this.concertModel.findByIdAndDelete(id).lean();
    if (!concert) {
      throw new BadRequestException(`Concert with id ${id} not found`);
    }
    if (concert.picturePath) {
      await this.fileService.removeFile(concert.picturePath);
    }
    if (concert.artist) {
      await this.usersService.toggleConcertInUser(concert.artist.toString(), id, false);
    }
    return concert;
  }
}