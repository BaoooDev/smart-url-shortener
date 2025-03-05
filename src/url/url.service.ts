import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from './url.schema';
import * as shortid from 'shortid';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<Url>) {}

  async shortenUrl(originalUrl: string): Promise<Url> {
    const shortUrl = shortid.generate();
    const newUrl = new this.urlModel({ originalUrl, shortUrl });
    return newUrl.save();
  }

  async getOriginalUrl(shortUrl: string): Promise<Url | null> {
    return this.urlModel.findOne({ shortUrl });
  }
  
}
