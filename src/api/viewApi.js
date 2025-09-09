// src/api/viewApi.js
import axios from "./axiosConfig";

// 게시글 조회수 증가
export const increaseArticleViewCount = async (articleId, userId) => {
  await axios.post(`/v1/article-views/articles/${articleId}`);
};

// 게시글 조회수 가져오기
export const getArticleViewCount = async (articleId) => {
  const response = await axios.get(
    `/v1/article-views/articles/${articleId}/count`
  );
  return response.data;
};
