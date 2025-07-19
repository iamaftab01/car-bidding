export const BID_SCHEMA_NAME = 'Bid';
export interface KafkaBidMessage {
  userId: string;
  auctionId: string;
  bidAmount: number;
  socketId: string;
}
