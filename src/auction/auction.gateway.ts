/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { CreateBidDto } from '../bid/dto/create-bid.dto';
import { JoinAuctionDto } from './dto/join-auction.dto';
import { AuctionEndDto } from './dto/auction-end.dto';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { ConfigService } from '@nestjs/config';
import { KafkaBidMessage } from '../bid/bid.type';
import { AuctionService } from './auction.service';
import { Injectable } from '@nestjs/common';
import { EVENTS } from 'src/common/events.enum';

@WebSocketGateway()
@Injectable()
export class AuctionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly auctionService: AuctionService,
    private readonly kafkaProducer: KafkaProducerService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    const auctionId = client.handshake.query.auctionId as string;
    const userId = client.handshake.query.userId as string;

    if (auctionId && userId) {
      client.data.userId = userId;
      await this.joinUserIntoAuction(client, userId, auctionId);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('Error: In handleDisconnect');
    const auctionId = client.handshake.query.auctionId as string;
    const userId = client.data.userId as string;
    if (userId) {
      await client.leave(`auction:${auctionId}`);

      this.notifyEvent(client.id, EVENTS.USER_LEFT, userId);
    }
  }

  async joinUserIntoAuction(client: Socket, userId: string, auctionId: string) {
    await client.join(`auction:${auctionId}`);
  }

  @SubscribeMessage('joinAuction')
  async handleJoinAuction(
    @MessageBody() joinAuctionDto: JoinAuctionDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { auctionId, userId } = joinAuctionDto;
    if (auctionId && userId) {
      client.data.userId = userId;
      await this.joinUserIntoAuction(client, userId, auctionId);
    } else {
      client.emit('error', 'Invalid auctionId or userId');
    }
  }

  @SubscribeMessage('placeBid')
  async handleBid(
    @MessageBody() createBidDto: CreateBidDto,
    @ConnectedSocket() client: Socket,
  ) {
    const topic = this.configService.get<string>('KAFKA_BIDS_TOPIC')!;
    const socketId = client.id;

    const kafkBidMessage: KafkaBidMessage = {
      auctionId: createBidDto.auctionId,
      userId: createBidDto.userId,
      bidAmount: createBidDto.bidAmount,
      socketId: client.id,
    };

    await this.kafkaProducer.send(topic, kafkBidMessage);

    this.notifyEvent(socketId, EVENTS.BID_QUEUED, {
      message: `Bid queued for auction ${createBidDto.auctionId}`,
    });

    return;
  }

  @SubscribeMessage('auctionEnd')
  async handleAuctionEnd(@MessageBody() auctionEndDto: AuctionEndDto) {
    const { auctionId } = auctionEndDto;

    const highestBid = await this.auctionService.getHighestBid(auctionId);

    if (!highestBid) {
      this.notifyEvent(`auction:${auctionId}`, EVENTS.AUCTION_END, {
        message: 'No bids were placed',
        auctionId,
      });
      return;
    }

    const { userId, bidPrice } = highestBid;

    this.notifyEvent(`auction:${auctionId}`, EVENTS.AUCTION_END, {
      auctionId,
      winner: {
        userId,
        bidPrice,
      },
    });

    const sockets = await this.server.in(`auction:${auctionId}`).fetchSockets();
    sockets.forEach((socket) => socket.leave(`auction:${auctionId}`));
  }

  notifyEvent(channel: string, event: EVENTS, payload: unknown) {
    this.server.to(channel).emit(event, payload);

    console.log(
      `Event send successfully: ${JSON.stringify(event)} with details: ${JSON.stringify(payload)}`,
    );
  }
}
