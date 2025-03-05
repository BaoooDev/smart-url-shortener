import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config(); // Load biến môi trường từ .env

@Injectable()
export class GeminiService {
  private GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  private GEMINI_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText';

  async checkUrlSafety(url: string): Promise<boolean> {
    const prompt = `Analyze the following URL and determine if it contains harmful or unsafe content: ${url}`;

    try {
      const response = await axios.post(`${this.GEMINI_URL}?key=${this.GEMINI_API_KEY}`, {
        prompt,
      });

      const result = response.data;
      console.log('Gemini API Response:', result);

      // Phân tích kết quả và quyết định URL có an toàn không
      return !result.includes('unsafe') && !result.includes('malicious');
    } catch (error) {
      console.error('Error calling Gemini API:', error.message);
      return false; // Nếu có lỗi, giả sử URL không an toàn
    }
  }
}
