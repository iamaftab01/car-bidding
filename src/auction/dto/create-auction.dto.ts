import { IsString, IsNumber, IsISO8601, Min, Length } from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  @Length(1, 100)
  public readonly carName: string;

  @IsNumber()
  @Min(0)
  public readonly startingBid: number;

  @IsISO8601()
  public readonly startTime: string;

  @IsISO8601()
  public readonly endTime: string;
}
