import React, { useState } from "react";
import axios from "axios";

const ShortenForm: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // ✅ Thêm biến lưu lỗi

  const handleShortenUrl = async () => {
    setErrorMessage(""); // Xóa lỗi cũ trước khi gửi request
    setShortUrl("");

    try {
      const response = await axios.post("http://localhost:3000/url/shorten", {
        originalUrl,
      });

      setShortUrl(response.data.shortUrl);
    } catch (error: any) {
      console.error("❌ Lỗi API:", error.response?.data?.message || error.message);

      // ✅ Nếu lỗi do URL độc hại, hiển thị cảnh báo
      if (error.response?.status === 400) {
        setErrorMessage("🚨 Cảnh báo: URL này bị đánh dấu là độc hại!");
      } else {
        setErrorMessage("❌ Đã có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96">
      
      <input
        type="text"
        placeholder="Nhập URL cần rút gọn..."
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        className="w-full p-2 mb-2 text-black rounded"
      />
      
      <button
        onClick={handleShortenUrl}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Rút gọn
      </button>

      {/* ✅ Hiển thị thông báo lỗi nếu có */}
      {errorMessage && (
        <div className="bg-red-600 text-white mt-4 p-2 rounded">
          {errorMessage}
        </div>
      )}

      {/* ✅ Hiển thị URL rút gọn nếu thành công */}
      {shortUrl && (
        <div className="mt-4">
          <p className="text-green-400">✅ URL rút gọn:</p>
          <a href={`http://localhost:3000/url/${shortUrl}`} className="text-blue-300">
            {`http://localhost:3000/url/${shortUrl}`}
          </a>
        </div>
      )}
    </div>
  );
};

export default ShortenForm;
