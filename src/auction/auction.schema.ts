import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class HighestBidDetails extends Document {
  @Prop({ required: true })
  bidPrice: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

@Schema()
export class Auction extends Document {
  @Prop({ required: true })
  carName: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true })
  startingBid: number;

  @Prop({ type: HighestBidDetails, default: null })
  highestBidDetails?: HighestBidDetails;

  @Prop({
    required: true,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled',
  })
  status: string;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
