import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type ConcertDocument = Concert & Document;

@Schema({ timestamps: true })
export class Concert {
  _id: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  artist: ObjectId;

  @Prop({ required: true })
  artistName: string;

  @Prop({ required: true })
  city: string;
  
  @Prop({ required: true })
  venue: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  ticketsQuantity: number;

  @Prop({ required: true })
  ticketPrice: number;

  @Prop()
  picturePath: string;
  
  @Prop()
  schemePath: string;
}

export const ConcertSchema = SchemaFactory.createForClass(Concert);