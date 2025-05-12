import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Track, TrackDocument} from "./entities/track.entity";
import {Model, ObjectId} from "mongoose";
import {CreateTrackDto} from "./dto/create-track.dto";
import {FileService, FileType} from "../file/file.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    private fileService: FileService,
    private usersService: UsersService
  ) {}

  async create(dto: CreateTrackDto, userId: string, userName: string, audio, picture): Promise<Track> {
  const audioPath = await this.fileService.createFile(FileType.AUDIO, audio);
  const picturePath = await this.fileService.createFile(FileType.IMAGE, picture);

  const track = await this.trackModel.create({
    ...dto,
    artistId: userId,
    artistName: userName,
    audio: audioPath,
    picture: picturePath,
  });

  await this.usersService.addTrackToUploads(userId, track.id);

  return track;
}

  async getAll(
    count = 10, 
    offset = 0, 
    sortBy: 'createdAt' | 'likes' | 'listens' = 'createdAt'
  ): Promise<Track[]> {
    const tracks = await this.trackModel
      .find()
      .sort({ [sortBy]: -1 })
      .skip(Number(offset))
      .limit(Number(count));
    return tracks;
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel.findById(id)
    if (!track) {
      throw new BadRequestException(`Track with id ${id} not found`);
    }
    return track;
  }

  async delete(id: ObjectId, userId: string, userRole: string): Promise<ObjectId> {
    const track = await this.trackModel.findById(id);

    if (!track) {
      throw new BadRequestException(`Track with id ${id} not found`);
    }

    if (track.artistId.toString() !== userId && userRole !== 'admin') {
      throw new UnauthorizedException(`You are not authorized to delete this track`);
    }

    this.fileService.removeFile(track.audio);
    this.fileService.removeFile(track.picture);

    await this.trackModel.findByIdAndDelete(id);

    return track._id as ObjectId;
  }

  async listen(id: ObjectId): Promise<void> {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new BadRequestException(`Track with id ${id} not found`);
    }
    track.listens += 1;
    await track.save();
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel.find({
      name: {$regex: new RegExp(query, 'i')}
    })
    return tracks;
  }

  async like(id: string): Promise<void> {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new BadRequestException(`Track with id ${id} not found`);
    }
    track.likes += 1;
    await track.save();
  }
}
