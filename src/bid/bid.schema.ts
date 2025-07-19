import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Bid extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Auction' })
  auctionId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  bidAmount: number;

  @Prop({ default: () => new Date() })
  timestamp: Date;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
