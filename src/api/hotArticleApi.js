// src/api/hotArticleApi.js
import axios from "./axiosConfig";

// 인기 게시글 목록 조회
export const fetchHotArticles = async () => {
  // 백엔드 API의 날짜 형식을 맞춰주기 위해 현재 날짜를 YYYY-MM-DD 형식으로 변환
  const today = new Date().toISOString().slice(0, 10);
  const response = await axios.get(`/v1/hot-articles/articles/date/${today}`);
  return response.data;
};
