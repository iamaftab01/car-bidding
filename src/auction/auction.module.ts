import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AUCTION_SCHEMA_NAME } from './auction.type';
import { AuctionSchema } from './auction.schema';
import { RedisModule } from '../redis/redis.module';
import { KafkaModule } from '../kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { AuctionGateway } from './auction.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AUCTION_SCHEMA_NAME,
        schema: AuctionSchema,
      },
    ]),
    RedisModule,
    KafkaModule,
    ConfigModule,
  ],
  controllers: [AuctionController],
  providers: [AuctionService, AuctionGateway],
  exports: [AuctionService, AuctionGateway],
})
export class AuctionModule {}
