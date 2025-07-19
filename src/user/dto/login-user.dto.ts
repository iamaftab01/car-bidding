import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email for the user',
  })
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}
