import { Injectable, OnModuleInit } from '@nestjs/common';
import { BidService } from '../bid/bid.service';
import { AuctionGateway } from '../auction/auction.gateway';
import { KafkaConsumerService } from '../kafka/kafka-consumer.service';
import { ConfigService } from '@nestjs/config';
import { KafkaBidMessage } from './bid.type';
import { HighestBidInfo } from '../auction/auction.type';
import { AuctionService } from 'src/auction/auction.service';
import { EVENTS } from 'src/common/events.enum';

@Injectable()
export class BidKafkaConsumerService implements OnModuleInit {
  constructor(
    private readonly bidService: BidService,
    private readonly auctionService: AuctionService,
    private readonly auctionGateway: AuctionGateway,
    private readonly kafkaConsumerService: KafkaConsumerService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const topic = this.configService.get<string>('KAFKA_BIDS_TOPIC')!;

    await this.kafkaConsumerService.connectAndSubscribe(
      topic,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.handleBidMessage.bind(this),
    );
  }

  private async handleBidMessage(value: string) {
    try {
      const bid = JSON.parse(value) as KafkaBidMessage;
      const { auctionId, userId, bidAmount, socketId } = bid;

      const current: HighestBidInfo | null =
        await this.auctionService.getHighestBid(auctionId);

      if (current && bidAmount <= current.bidPrice) {
        if (socketId) {
          this.auctionGateway.notifyEvent(socketId, EVENTS.BID_REJECTED, {
            message: 'Bid must be higher than current highest bid',
          });
        }
        return;
      }

      // Store new highest bid in Redis
      await this.auctionService.updateHighestAuctionBid(auctionId, {
        bidPrice: bidAmount,
        userId,
      });

      // Save in DB
      await this.bidService.create(bid);

      // Broadcast to room
      this.auctionGateway.notifyEvent(
        `auction:${auctionId}`,
        EVENTS.BID_ACCEPTED,
        {
          userId,
          bidPrice: bidAmount,
          timestamp: new Date(),
        },
      );
    } catch (err) {
      console.error('Failed to process bid message:', err);
    }
  }
}
