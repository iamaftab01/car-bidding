import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name for the user',
  })
  @IsString()
  @IsNotEmpty()
  public readonly username: string;

  @ApiProperty({
    description: 'Email for the user',
  })
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}
