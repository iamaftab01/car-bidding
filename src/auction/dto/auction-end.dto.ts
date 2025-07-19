import { IsMongoId } from 'class-validator';

export class AuctionEndDto {
  @IsMongoId()
  public readonly auctionId: string;
}
