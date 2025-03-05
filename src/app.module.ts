import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModule } from './url/url.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load biến môi trường
    MongooseModule.forRoot(process.env.MONGO_URI || ''), // Load MONGO_URI
    UrlModule,
  ],
})
export class AppModule {}
