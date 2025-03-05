import { Controller, Post, Get, Body, Param, Res, NotFoundException } from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shortenUrl(@Body('originalUrl') originalUrl: string) {
    return this.urlService.shortenUrl(originalUrl);
  }

  @Get(':shortUrl')
  async redirectToOriginal(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const url = await this.urlService.trackClick(shortUrl);
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    // Redirect đến URL gốc
    return res.redirect(url.originalUrl);
  }
  @Get('stats/:shortUrl')
async getUrlStats(@Param('shortUrl') shortUrl: string) {
  const url = await this.urlService.getOriginalUrl(shortUrl);
  if (!url) {
    throw new NotFoundException('Short URL not found');
  }

  return {
    originalUrl: url.originalUrl,
    shortUrl: url.shortUrl,
    clickCount: url.clickCount,
    accessHistory: url.accessHistory,
  };
}

}
