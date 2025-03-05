import { useState } from "react";
import { getUrlStats } from "../api";

const UrlStats: React.FC = () => {
  const [shortUrl, setShortUrl] = useState<string>("");
  const [stats, setStats] = useState<any>(null);

  const handleCheckStats = async () => {
    const data = await getUrlStats(shortUrl);
    setStats(data);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nhập URL rút gọn..."
        value={shortUrl}
        onChange={(e) => setShortUrl(e.target.value)}
      />
      <button onClick={handleCheckStats}>📊 Xem thống kê</button>

      {stats && (
        <div className="stats">
          <p>🔗 <strong>URL gốc:</strong> <br /> {stats.originalUrl}</p>
          <p>📈 <strong>Số lượt click:</strong> {stats.clickCount}</p>
          <p>⏳ <strong>Lịch sử truy cập:</strong></p>
          <ul>
            {stats.accessHistory.map((date: string, index: number) => (
              <li key={index}>🕒 {new Date(date).toLocaleString()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UrlStats;
