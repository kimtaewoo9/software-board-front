// src/api/likeApi.js
import axios from "./axiosConfig";

// 게시글 좋아요
export const likeArticle = async (articleId) => {
  // ✨ userId를 1로 고정
  const userId = 1;
  await axios.post(`/v1/article-likes/articles/${articleId}/users/${userId}`);
};

// 게시글 좋아요 취소
export const unlikeArticle = async (articleId) => {
  // ✨ userId를 1로 고정
  const userId = 1;
  await axios.delete(`/v1/article-likes/articles/${articleId}/users/${userId}`);
};

// 특정 사용자가 특정 게시글에 좋아요를 눌렀는지 확인
export const checkArticleLikeStatus = async (articleId, userId) => {
  const response = await axios.get(
    `/v1/article-likes/articles/${articleId}/users/${userId}`
  );
  return response.data;
};
