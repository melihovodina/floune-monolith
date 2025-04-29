import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileService, FileType } from "../file/file.service";
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService
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
      picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    }

    const user = await this.userModel.create({ 
      ...createUserDto,
      picture: picturePath 
    });

    return user;
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
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

      picturePath = this.fileService.createFile(FileType.IMAGE, picture);
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