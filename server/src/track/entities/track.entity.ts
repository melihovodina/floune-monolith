import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema({ timestamps: true })
export class Track {
  @Prop()
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  artist: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Playlist' })
  playlist: ObjectId;

  @Prop({ default: "We don't know the lyrics to this song" })
  text: string;

  @Prop({ default: 0 })
  listens: number;
  
  @Prop({ default: 0 })
  likes: number;

  @Prop()
  picture: string;

  @Prop()
  audio: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);