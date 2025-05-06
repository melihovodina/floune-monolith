import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema({ timestamps: true })
export class Track {
  @Prop()
  name: string;

  @Prop()
  artistName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  artistId: ObjectId;
  
  @Prop({ default: "No description" })
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