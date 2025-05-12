import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileService, FileType } from "../file/file.service";
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService,
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
  ) {}

  async create(createUserDto: CreateUserDto, picture?) {
    const existingUser = await this.userModel.findOne({
      $or: [{ email: createUserDto.email }, { name: createUserDto.name }],
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or name already exists');
    }

    let picturePath: string | undefined;
    if (picture) {
      picturePath = await this.fileService.createFile(FileType.IMAGE, picture);
    }

    const user = await this.userModel.create({ 
      ...createUserDto,
      picture: picturePath 
    });

    return user;
  }

  async findAll(count: number, offset: number) {
    return this.userModel
      .find()
      .skip(offset)
      .limit(count)
      .exec();
  }

  async findOne(id: string, count?: number, offset?: number) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }

    if (count && offset) {
      user.likedTracks = user.likedTracks.slice(offset, offset + count);
    }

    return user;
  }

  async findByName(name: string) {
    const user = await this.userModel.findOne({ name }).exec();
    if (!user) {
      throw new BadRequestException(`User with name ${name} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, picture?) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
  
    if (updateUserDto.email || updateUserDto.name) {
      const existingUser = await this.userModel.findOne({
        $or: [
          { email: updateUserDto.email },
          { name: updateUserDto.name },
        ]
      });
  
      if (existingUser) {
        throw new BadRequestException('User with this email or name already exists');
      }
    }
  
    let picturePath: string | undefined;
    if (picture) {
      if (user.picture) {
        this.fileService.removeFile(user.picture);
      }
      picturePath = await this.fileService.createFile(FileType.IMAGE, picture);
    }
  
    const updatedData = {
      ...updateUserDto,
      ...(picturePath && { picture: picturePath }),
    };
  
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).exec();
  
    return updatedUser;
  }

  async addTrackToFavorites(userId: string, trackId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }
    
    if (user.likedTracks.some((id) => id.toString() === trackId)) {
      throw new BadRequestException(`Track is already in favorites`);
    }
    
    user.likedTracks.push(trackId as any);
    await user.save();

    await this.trackService.like(trackId, 1);
    
    return user.likedTracks;
  }

  async removeTrackFromFavorites(userId: string, trackId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }

    if (!user.likedTracks.some((id) => id.toString() === trackId)) {
      throw new BadRequestException(`Track is not in favorites`);
    }

    user.likedTracks = user.likedTracks.filter(
      (likedTrackId) => likedTrackId.toString() !== trackId
    );
    await user.save();

    await this.trackService.like(trackId, -1);

    return user.likedTracks;
  }

  async addTrackToUploads(userId: string, trackId: ObjectId) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }
    
    user.uploadedTracks.push(trackId);
    await user.save();
    
    return user.uploadedTracks;
  }

  async removeTrackFromUploads(userId: ObjectId, trackId: ObjectId) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }

    user.uploadedTracks = user.uploadedTracks.filter(
      (uploadedTrackId) => uploadedTrackId.toString() !== trackId.toString()
    );
    await user.save();

    return user.uploadedTracks;
  }

  async banUser(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }

    user.banned = true;
    await user.save();

    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
  
    if (user.picture) {
      this.fileService.removeFile(user.picture);
    }
  
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
  
    return deletedUser;
  }
}