import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { BID_SCHEMA_NAME } from './bid.type';
import { BidSchema } from './bid.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from 'src/kafka/kafka.module';
import { BidKafkaConsumerService } from './bid-kafka-consumer.service';
import { AuctionModule } from 'src/auction/auction.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BID_SCHEMA_NAME,
        schema: BidSchema,
      },
    ]),
    KafkaModule,
    AuctionModule,
    ConfigModule,
  ],
  controllers: [BidController],
  providers: [BidService, BidKafkaConsumerService],
  exports: [BidService, BidKafkaConsumerService],
})
export class BidModule {}
