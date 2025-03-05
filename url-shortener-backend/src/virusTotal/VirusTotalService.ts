import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class VirusTotalService {
  private API_KEY = process.env.VIRUSTOTAL_API_KEY;
  private API_URL_SCAN = "https://www.virustotal.com/api/v3/urls";
  private API_URL_DOMAIN = "https://www.virustotal.com/api/v3/domains/";

  async checkUrlSafety(url: string): Promise<boolean> {
    try {
      console.log(`🔍 Đang kiểm tra URL: ${url}`);

      // 📌 Lấy domain từ URL (VD: http://malware.test.com -> malware.test.com)
      const domain = new URL(url).hostname;
      console.log(`🌐 Domain Extracted: ${domain}`);

      // 📌 Bước 1: Kiểm tra domain có tồn tại trên VirusTotal không
      const reportResponse = await axios.get(
        `${this.API_URL_DOMAIN}${domain}`,
        {
          headers: {
            "x-apikey": this.API_KEY
          },
        }
      );

      console.log("📩 Kết quả phân tích domain:", reportResponse.data);

      // 📌 Nếu domain có trong database, kiểm tra số lượng "malicious"
      if (reportResponse.data.data?.attributes?.last_analysis_stats?.malicious > 0) {
        console.log("⚠️ URL bị đánh dấu là độc hại!");
        return false;
      }

      // 📌 Nếu domain không có cảnh báo, thì URL được coi là an toàn
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn("⚠️ URL chưa có trên VirusTotal, gửi yêu cầu scan...");

        // 📌 Nếu URL chưa có trong database, gửi yêu cầu scan
        try {
          const scanResponse = await axios.post(
            this.API_URL_SCAN,
            { url },
            {
              headers: {
                "x-apikey": this.API_KEY,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("📩 Yêu cầu scan VirusTotal:", scanResponse.data);
          console.log("⌛ Đợi 10 giây để kiểm tra lại...");

          // 📌 Chờ 10 giây để VirusTotal xử lý scan
          await new Promise((resolve) => setTimeout(resolve, 10000));

          // 📌 Kiểm tra lại domain sau khi scan
          const finalReport = await axios.get(
            `${this.API_URL_DOMAIN}${new URL(url).hostname}`,
            {
              headers: {
                "x-apikey": this.API_KEY
              },
            }
          );

          console.log("📩 Kết quả sau khi scan:", finalReport.data);

          // 📌 Nếu số lượng malicious > 0, chặn URL
          return finalReport.data.data?.attributes?.last_analysis_stats?.malicious === 0;
        } catch (scanError) {
          console.error("❌ Lỗi khi gửi yêu cầu scan:", scanError.message);
          return true; // Nếu lỗi, cho phép URL (tránh crash API)
        }
      } else {
        console.error("❌ Lỗi gọi VirusTotal API:", error.message);
        return true; // Nếu lỗi khác xảy ra, mặc định cho phép URL
      }
    }
  }
}
