import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Auction } from './auction.schema';
import { AUCTION_SCHEMA_NAME } from './auction.type';

@Injectable()
export class AuctionCronService {
  constructor(
    @Inject(AUCTION_SCHEMA_NAME) private readonly auctionModel: Model<Auction>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async updateAuctionStatuses() {
    const now = new Date();

    await this.auctionModel.updateMany(
      { startTime: { $gt: now } },
      { $set: { status: 'scheduled' } },
    );

    await this.auctionModel.updateMany(
      { startTime: { $lte: now }, endTime: { $gt: now } },
      { $set: { status: 'active' } },
    );

    await this.auctionModel.updateMany(
      { endTime: { $lte: now } },
      { $set: { status: 'completed' } },
    );
  }
}
