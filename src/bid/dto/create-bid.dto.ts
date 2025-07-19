import { IsMongoId, IsNumber, Min } from 'class-validator';

export class CreateBidDto {
  @IsMongoId()
  public readonly userId: string;

  @IsMongoId()
  public readonly auctionId: string;

  @IsNumber()
  @Min(1)
  public readonly bidAmount: number;
}
