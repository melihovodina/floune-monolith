import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Concert, ConcertDocument } from './entities/concert.entity';
import { Model, Types } from 'mongoose';
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
    const concertDate = new Date(createConcertDto.date);
    const now = new Date();
    const minDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    if (concertDate < minDate) {
      throw new BadRequestException('Concert date must be at least 3 days from now');
    }

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

  async findAll(onlyNew = false) {
    const now = new Date();
    const query: any = {};
    if (onlyNew) {
      query.date = { $gte: now };
    }
    return this.concertModel.find(query).populate('artist', '_id name picture').lean();
  }

  async findOne(id: string) {
    const concert = await this.concertModel.findById(id).populate('artist', '_id name picture').lean();
    if (!concert) {
      throw new BadRequestException(`Concert with id ${id} not found`);
    }
    return concert;
  }

  async findByIds(ids: string[]) {
    const objectIds = ids.map(id => new Types.ObjectId(id));
    return this.concertModel.find({ _id: { $in: objectIds } }).populate('artist', '_id name picture').lean();
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

  async changeTicketsQuantity(concertId: string, quantity: number) {
    const concert = await this.concertModel.findById(concertId);
    if (!concert) {
      throw new BadRequestException(`Concert with id ${concertId} not found`);
    }
    const newQuantity = concert.ticketsQuantity + quantity;
    if (newQuantity < 0) {
      throw new BadRequestException('Not enough tickets available');
    }
    concert.ticketsQuantity = newQuantity;
    await concert.save();
    return concert;
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