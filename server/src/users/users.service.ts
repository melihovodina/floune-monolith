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
      const pictureResult = await this.fileService.createFile(FileType.IMAGE, picture);
      picturePath = pictureResult.path;
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
    full: boolean = false,
    role?: string
  ) {
    const query: any = {};

    if (role && ['user', 'artist', 'admin'].includes(role)) {
      query.role = role;
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
      usersQuery.select('_id name picture followers role');
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
      userQuery.select('_id name picture followers role uploadedTracks');
    }

    const user = await userQuery.lean();
    if (!user) {
      throw new BadRequestException(`User with this ${field} not found`);
    }
    return user;
  }

  async search(query: string) {
    const users = await this.userModel.find({
      name: { $regex: new RegExp(query, 'i') }
    }).select('_id name picture followers role');
    return users;
  }

  async update(id: string, updateUserDto: UpdateUserDto, picture?, full: boolean = false) {
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

      if (existingUser && existingUser._id.toString() !== id) {
        throw new BadRequestException('User with this email or name already exists');
      }
    }

    let picturePath: string | undefined;
    if (picture) {
      if (user.picture) {
        await this.fileService.removeFile(user.picture);
      }
      const pictureResult = await this.fileService.createFile(FileType.IMAGE, picture);
      picturePath = pictureResult.path;
    }

    let updateQuery: any = { ...updateUserDto };
    if (picturePath !== undefined) {
      updateQuery.picture = picturePath;
    }

    let updateOptions = { new: true };

    let updatedUser;
    if (updateUserDto.removePicture) {
      if (user.picture) {
        await this.fileService.removeFile(user.picture);
      }
      updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { ...updateQuery, $unset: { picture: 1 } },
        updateOptions
      ).lean();
    } else {
      updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateQuery,
        updateOptions
      ).lean();
    }

    if (!updatedUser) {
      throw new BadRequestException(`User with id ${id} not found after update`);
    }

    if (!full) {
      const { _id, name, picture, followers, role, uploadedTracks } = updatedUser;
      return { _id, name, picture, followers, role, uploadedTracks };
    }

    return updatedUser;
  }

  async toggleTrackFavorite(userId: string, trackId: string, add: boolean = false) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }

    if (add) {
      if (!user.likedTracks.some((id) => id.toString() === trackId)) {
        user.likedTracks.push(trackId as any);
        await user.save();
        await this.trackService.like(trackId, 1);
      }
      return { likedTracks: user.likedTracks, action: 'added' };
    } else {
      user.likedTracks = user.likedTracks.filter(
        (likedTrackId) => likedTrackId.toString() !== trackId
      );
      await user.save();
      await this.trackService.like(trackId, -1);
      return { likedTracks: user.likedTracks, action: 'removed' };
    }
  }

  async toggleTrackInUploads(userId: string, trackId: ObjectId, add: boolean = false) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }

    if (add) {
      if (!user.uploadedTracks.some((uploadedTrackId) => uploadedTrackId.toString() === trackId.toString())) {
        user.uploadedTracks.push(trackId);
        await user.save();
      }
      return { uploadedTracks: user.uploadedTracks, action: 'added' };
    } else {
      user.uploadedTracks = user.uploadedTracks.filter(
        (uploadedTrackId) => uploadedTrackId.toString() !== trackId.toString()
      );
      await user.save();
      return { uploadedTracks: user.uploadedTracks, action: 'removed' };
    }
  }

  async toggleUserFollows(currentUserId: string, targetUserId: string, follow: boolean = false) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow/unfollow yourself');
    }

    const currentUser = await this.userModel.findById(currentUserId).exec();
    const targetUser = await this.userModel.findById(targetUserId).exec();

    if (!currentUser || !targetUser) {
      throw new BadRequestException('User not found');
    }

    const isFollowing = currentUser.following.includes(targetUserId as any);

    if (follow) {
      if (isFollowing) {
        throw new BadRequestException('Already following this user');
      }
      currentUser.following.push(targetUserId as any);
      targetUser.followers += 1;
      await currentUser.save();
      await targetUser.save();
      return { following: currentUser.following, action: 'followed' };
    } else {
      if (!isFollowing) {
        throw new BadRequestException('You are not following this user');
      }
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = Math.max(0, targetUser.followers - 1);
      await currentUser.save();
      await targetUser.save();
      return { following: currentUser.following, action: 'unfollowed' };
    }
  }

  async toggleConcertInUser(userId: string, concertId: string, add: boolean = false) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }

    if (!user.concerts) {
      user.concerts = [];
    }

    if (add) {
      if (!user.concerts.some(id => id.toString() === concertId)) {
        user.concerts.push(concertId as any);
        await user.save();
      }
      return { concerts: user.concerts, action: 'added' };
    } else {
      user.concerts = user.concerts.filter(id => id.toString() !== concertId);
      await user.save();
      return { concerts: user.concerts, action: 'removed' };
    }
  }

  async toggleOrderInUser(userId: string, orderId: string, add: boolean = false) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }

    if (!user.orders) {
      user.orders = [];
    }

    if (add) {
      if (!user.orders.some(id => id.toString() === orderId)) {
        user.orders.push(orderId as any);
        await user.save();
      }
      return { orders: user.orders, action: 'added' };
    } else {
      user.orders = user.orders.filter(id => id.toString() !== orderId);
      await user.save();
      return { orders: user.orders, action: 'removed' };
    }
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
      await this.fileService.removeFile(user.picture);
    }
  
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
  
    return deletedUser;
  }
}