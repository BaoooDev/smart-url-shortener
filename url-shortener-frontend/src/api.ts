import axios from "axios";

const API_BASE_URL = "http://localhost:3000/url";

export const shortenUrl = async (originalUrl: string) => {
  const response = await axios.post(`${API_BASE_URL}/shorten`, { originalUrl });
  return response.data;
};

export const getUrlStats = async (shortUrl: string) => {
  const response = await axios.get(`${API_BASE_URL}/stats/${shortUrl}`);
  return response.data;
};
