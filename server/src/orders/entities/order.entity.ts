import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  _id: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Concert', required: true })
  concertId: ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  ticketsQuantity: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop()
  cancelled: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);