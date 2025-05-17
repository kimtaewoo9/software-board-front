// src/api/commentApi.js
import axios from './axiosConfig';

// 댓글 목록 조회
export const fetchComments = async (articleId) => {
  const response = await axios.get(`/articles/${articleId}/comments`);
  return response.data;
};

// 댓글 생성
export const createComment = async ({ articleId, content }) => {
  const response = await axios.post(`/articles/${articleId}/comments`, { content });
  return response.data;
};

// 댓글 수정
export const updateComment = async ({ id, content }) => {
  const response = await axios.put(`/comments/${id}`, { content });
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (id) => {
  await axios.delete(`/comments/${id}`);
  return id;
};