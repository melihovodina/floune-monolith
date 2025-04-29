import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  banned: boolean;

  @Prop({ enum: ['user', 'artist'], default: 'user' })
  role: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Track' }] })
  likedTracks: ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Track' }] })
  uploadedTracks: ObjectId[];

  @Prop()
  picture: string;
}

export const UserSchema = SchemaFactory.createForClass(User);