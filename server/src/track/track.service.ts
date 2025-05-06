import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Track, TrackDocument} from "./entities/track.entity";
import {Model, ObjectId} from "mongoose";
import {CreateTrackDto} from "./dto/create-track.dto";
import {FileService, FileType} from "../file/file.service";

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    private fileService: FileService
  ) {}

  async create(dto: CreateTrackDto, userId: string, userName: string, audio, picture): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    
    const track = await this.trackModel.create({
      ...dto,
      artistId: userId,
      artistName: userName,
      audio: audioPath,
      picture: picturePath,
    });
  
    return track;
  }

  async getAll(count = 10, offset = 0): Promise<Track[]> {
    const tracks = await this.trackModel.find().skip(Number(offset)).limit(Number(count));
    return tracks;
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = await this.trackModel.findById(id).populate('comments');
    if (!track) {
      throw new Error(`Track with id ${id} not found`);
    }
    return track;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const track = await this.trackModel.findByIdAndDelete(id);
    if (!track) {
      throw new Error(`Track with id ${id} not found`);
    }
    return track._id as ObjectId;
  }

  async listen(id: ObjectId): Promise<void> {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new Error(`Track with id ${id} not found`);
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
      throw new Error(`Track with id ${id} not found`);
    }
    track.likes += 1;
    await track.save();
  }
}
