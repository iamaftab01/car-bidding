import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    match: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, // regex for email
  })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
