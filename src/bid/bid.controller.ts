import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { BidService } from './bid.service';
import { MongooseValidationExceptionFilter } from 'src/mongoose-exception.filter';

@Controller('bid')
@UseFilters(MongooseValidationExceptionFilter)
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Get('user/:userId')
  async findAllBidsByUserId(@Param('userId') userId: string) {
    return await this.bidService.findAllBidsByUserId(userId);
  }

  @Get('auction/:auctionId')
  async findAllBidsByAuctionId(@Param('auctionId') auctionId: string) {
    return await this.bidService.findAllBidsByAuctionId(auctionId);
  }
}
