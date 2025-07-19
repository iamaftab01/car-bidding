import { Injectable } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Model } from 'mongoose';
import { Auction } from './auction.schema';
import { AUCTION_SCHEMA_NAME, HighestBidInfo } from './auction.type';
import { InjectModel } from '@nestjs/mongoose';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuctionService {
  constructor(
    @InjectModel(AUCTION_SCHEMA_NAME)
    private readonly auctionModel: Model<Auction>,
    private readonly redisService: RedisService,
  ) {}
  create(createAuctionDto: CreateAuctionDto): Promise<Auction> {
    const startTime = new Date(createAuctionDto.startTime);
    const endTime = new Date(createAuctionDto.endTime);
    const now = new Date();

    let status: 'scheduled' | 'active' | 'completed';

    if (now < startTime) {
      status = 'scheduled';
    } else if (now >= startTime && now <= endTime) {
      status = 'active';
    } else {
      status = 'completed';
    }

    const createdAuction = new this.auctionModel({
      carName: createAuctionDto.carName,
      startingBid: createAuctionDto.startingBid,
      startTime,
      endTime,
      status,
    });

    return createdAuction.save();
  }

  getActiveAuctions(): Promise<Auction[]> {
    return this.auctionModel.find({ status: 'active' });
  }

  async getAuctionById(id: string): Promise<Auction | null> {
    return this.auctionModel.findById(id).exec();
  }

  async deleteAuctionById(id: string) {
    return this.auctionModel.findByIdAndDelete(id).exec();
  }

  async getHighestBid(auctionId: string): Promise<HighestBidInfo | null> {
    const highestBid = await this.redisService.getHighestBid(auctionId);

    if (!highestBid) {
      const auction = await this.getAuctionById(auctionId);

      if (!auction?.highestBidDetails) {
        return null;
      }

      return auction.highestBidDetails as unknown as HighestBidInfo;
    }

    return highestBid;
  }

  async updateHighestAuctionBid(auctionId: string, highestBid: HighestBidInfo) {
    const { userId, bidPrice } = highestBid;

    await this.auctionModel
      .findByIdAndUpdate(
        auctionId,
        {
          $set: {
            highestBidDetails: {
              userId,
              bidPrice,
            },
          },
        },
        { new: true }, // Return the updated document
      )
      .exec();

    await this.redisService.setHighestBid(auctionId, highestBid);

    return;
  }
}
