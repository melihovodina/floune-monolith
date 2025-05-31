import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileService, FileType } from "../file/file.service";
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { TrackService } from 'src/track/track.service';
import { UsersSortBy } from 'src/utils/types';

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

  async getAll(
    count: number,
    offset: number,
    sortBy: UsersSortBy = 'createdAt',
    full: boolean = false
  ) {
    const query: any = {};

    if (['user', 'artist', 'admin'].includes(sortBy)) {
      query.role = sortBy;
    }

    const sort: Record<string, 1 | -1> = {};
    if (sortBy === 'followers' || sortBy === 'createdAt') {
      sort[sortBy] = -1;
    }

    let usersQuery = this.userModel
      .find(query)
      .sort(sort)
      .skip(Number(offset))
      .limit(Number(count));

    if (!full) {
      usersQuery.select('name picture followers role');
    }

    const users = await usersQuery.lean();

    return users;
  }

  async findOne(field: 'id' | 'name' | 'email', value: string, full: boolean = false) {
    let query: any = {};
    if (field === 'id') {
      query._id = value;
    } else {
      query[field] = value;
    }

    let userQuery = this.userModel.findOne(query);
    if (!full) {
      userQuery.select('name picture followers role uploadedTracks');
    }

    const user = await userQuery.lean();
    if (!user) {
      throw new BadRequestException(`User with ${field} ${value} not found`);
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
  
    if (updateUserDto.removePicture) {
      if (user.picture) {
        this.fileService.removeFile(user.picture);
      }
      picturePath = undefined;
    }

    const updatedData = {
      ...updateUserDto,
      ...(picturePath !== undefined ? { picture: picturePath } : {}),
      ...(updateUserDto.removePicture ? { picture: undefined } : {}),
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

  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const currentUser = await this.userModel.findById(currentUserId).exec();
    const targetUser = await this.userModel.findById(targetUserId).exec();

    if (!currentUser || !targetUser) {
      throw new BadRequestException('User not found');
    }

    if (currentUser.following.includes(targetUserId as any)) {
      throw new BadRequestException('Already following this user');
    }

    currentUser.following.push(targetUserId as any);
    targetUser.followers += 1;

    await currentUser.save();
    await targetUser.save();

    return currentUser.following;
  }

  async unfollowUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    const currentUser = await this.userModel.findById(currentUserId).exec();
    const targetUser = await this.userModel.findById(targetUserId).exec();

    if (!currentUser || !targetUser) {
      throw new BadRequestException('User not found');
    }

    if (!currentUser.following.includes(targetUserId as any)) {
      throw new BadRequestException('You are not following this user');
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.followers = Math.max(0, targetUser.followers - 1);

    await currentUser.save();
    await targetUser.save();

    return currentUser.following;
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