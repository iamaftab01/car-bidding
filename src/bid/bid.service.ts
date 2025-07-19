import { Injectable } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { BID_SCHEMA_NAME } from './bid.type';
import { Model } from 'mongoose';
import { Bid } from './bid.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(BID_SCHEMA_NAME) private readonly bidModel: Model<Bid>,
  ) {}

  create(createBidDto: CreateBidDto): Promise<Bid> {
    const createdBid = new this.bidModel({
      userId: createBidDto.userId,
      auctionId: createBidDto.auctionId,
      bidAmount: createBidDto.bidAmount,
      timestamp: new Date().toISOString(),
    });

    return createdBid.save();
  }

  findAllBidsByUserId(userId: string): Promise<Bid[]> {
    return this.bidModel.find({ userId: userId }).exec();
  }

  findAllBidsByAuctionId(auctionId: string): Promise<Bid[]> {
    return this.bidModel.find({ auctionId: auctionId }).exec();
  }
}
