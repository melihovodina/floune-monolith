import { Module, forwardRef } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './entities/track.entity';
import { FileService } from '../file/file.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    AuthModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [TrackController],
  providers: [TrackService, FileService],
  exports: [TrackService],
})
export class TrackModule {}