import {Module} from "@nestjs/common";
import {TrackModule} from "./track/track.module";
import {MongooseModule} from "@nestjs/mongoose";
import {FileModule} from "./file/file.module";
import * as path from 'path'
import {ServeStaticModule} from "@nestjs/serve-static";
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { config } from "dotenv";
import { ConcertsModule } from './concerts/concerts.module';
config({path: "./.env"})

@Module({
  imports: [
    ServeStaticModule.forRoot({rootPath: path.resolve(process.cwd(), 'static')}),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/floune'),
    TrackModule,
    FileModule,
    UsersModule,
    AuthModule,
    ConcertsModule
  ]
})

export class AppModule {}
