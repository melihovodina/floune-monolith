import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type PlaylistDocument = Playlist & Document;

@Schema({ timestamps: true })
export class Playlist {
  _id: ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  artist: ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Track' }] })
  tracks: ObjectId[];

  @Prop({ default: 0 })
  likes: number;

  @Prop()
  picture: string;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);