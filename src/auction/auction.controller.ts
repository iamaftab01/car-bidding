import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { MongooseValidationExceptionFilter } from 'src/mongoose-exception.filter';

@Controller('auction')
@UseFilters(MongooseValidationExceptionFilter)
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  async create(@Body() createAuctionDto: CreateAuctionDto) {
    return await this.auctionService.create(createAuctionDto);
  }

  @Get()
  getActiveAuctions() {
    return this.auctionService.getActiveAuctions();
  }

  @Get(':id')
  async getAuctionById(@Param('id') id: string) {
    const auction = await this.auctionService.getAuctionById(id);
    if (!auction) {
      throw new NotFoundException(`Auction with ${id} not found`);
    }

    return auction;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedAuction = await this.auctionService.deleteAuctionById(id);

    if (!deletedAuction) {
      throw new NotFoundException(`Auction with ${id} not found`);
    }

    return deletedAuction;
  }
}
