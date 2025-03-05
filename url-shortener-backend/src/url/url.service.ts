import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as shortid from 'shortid';
import { Url } from './url.schema';
import { VirusTotalService } from "../virusTotal/VirusTotalService";

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    private readonly virusTotalService: VirusTotalService // ✅ Inject service đúng cách
  ) {}

  async shortenUrl(originalUrl: string): Promise<Url> {
    // ✅ Kiểm tra nếu URL đã tồn tại trong database
    const existingUrl = await this.urlModel.findOne({ originalUrl });
    if (existingUrl) {
      return existingUrl;
    }

    // ✅ Kiểm tra URL có an toàn không bằng VirusTotal
    const isSafe = await this.virusTotalService.checkUrlSafety(originalUrl);
    if (!isSafe) {
      throw new BadRequestException("🚨 URL này bị đánh dấu là độc hại!");
    }

    // ✅ Nếu URL hợp lệ, tạo short URL
    const shortUrl = shortid.generate();
    const newUrl = new this.urlModel({ originalUrl, shortUrl });
    return newUrl.save();
  }

  async getOriginalUrl(shortUrl: string): Promise<Url | null> {
    return this.urlModel.findOne({ shortUrl });
  }

  async trackClick(shortUrl: string): Promise<Url | null> {
    const url = await this.urlModel.findOne({ shortUrl });
    if (!url) {
      return null;
    }

    // ✅ Cập nhật số lượt click và lưu thời gian truy cập
    url.clickCount += 1;
    url.accessHistory.push(new Date());
    await url.save();
    return url;
  }
}
