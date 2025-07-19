import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { HighestBidInfo } from '../auction/auction.type';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL')!;
    this.client = new Redis(redisUrl);
  }

  onModuleInit() {
    this.client.on('connect', () => console.log('Redis connected'));
    this.client.on('error', (err) => console.error('Redis error', err));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async getHighestBid(auctionId: string): Promise<HighestBidInfo | null> {
    const highestBidJson = await this.client.get(
      `auction:${auctionId}:highestBid`,
    );

    if (!highestBidJson) {
      return null;
    }

    return JSON.parse(highestBidJson) as HighestBidInfo;
  }

  async setHighestBid(auctionId: string, highestBid: HighestBidInfo) {
    await this.client.set(
      `auction:${auctionId}:highestBid`,
      JSON.stringify(highestBid),
    );
  }
}
