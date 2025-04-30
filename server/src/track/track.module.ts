import {Module} from "@nestjs/common";
import {TrackController} from "./track.controller";
import {TrackService} from "./track.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Track, TrackSchema} from "./entities/track.entity";
import {FileService} from "../file/file.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{name: Track.name, schema: TrackSchema}]),
    AuthModule
  ],
  controllers: [TrackController],
  providers: [TrackService, FileService]
})

export class TrackModule {}
