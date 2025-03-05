import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shortenUrl(@Body('originalUrl') originalUrl: string) {
    return this.urlService.shortenUrl(originalUrl);
  }

  @Get(':shortUrl')
  async getOriginalUrl(@Param('shortUrl') shortUrl: string) {
    return this.urlService.getOriginalUrl(shortUrl);
  }
}
