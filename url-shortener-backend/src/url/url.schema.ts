import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // Tự động lưu createdAt, updatedAt
export class Url extends Document {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortUrl: string;

  @Prop({ default: 0 })
  clickCount: number; // Đếm số lượt click

  @Prop({ type: [Date], default: [] })
  accessHistory: Date[]; // Lưu lịch sử truy cập theo timestamp
}

export const UrlSchema = SchemaFactory.createForClass(Url);
