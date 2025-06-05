import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: ObjectId;

  @Prop({ unique: true })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  banned: boolean;

  @Prop({ enum: ['user', 'artist', 'admin'], default: 'user' })
  role: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Track' }] })
  likedTracks: ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Track' }] })
  uploadedTracks: ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  following: ObjectId[];

  @Prop({ default: 0 })
  followers: number;  

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Concert' }] })
  concerts: ObjectId[]

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Order' }] })
  orders: ObjectId[]

  @Prop()
  picture: string;
}

export const UserSchema = SchemaFactory.createForClass(User);