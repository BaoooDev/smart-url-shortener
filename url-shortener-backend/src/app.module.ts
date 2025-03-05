import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModule } from './url/url.module';
import { VirusTotalService } from './virusTotal/VirusTotalService';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''), 
    UrlModule, 
  ],
  providers: [VirusTotalService],
  exports: [VirusTotalService]
})
export class AppModule {}
