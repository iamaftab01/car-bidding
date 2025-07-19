import { IsMongoId } from 'class-validator';

export class JoinAuctionDto {
  @IsMongoId()
  public readonly auctionId: string;

  @IsMongoId()
  public readonly userId: string;
}
