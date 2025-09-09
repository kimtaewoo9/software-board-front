// src/api/commentApi.js
import axios from "./axiosConfig";

// 댓글 목록 조회 (백엔드 /v1/comments 엔드포인트에 맞춰 수정)
export const fetchComments = async (articleId, page = 1, size = 10) => {
  const params = { articleId, page, pageSize: size };
  const response = await axios.get(`/v1/comments`, { params });
  return response.data;
};

// 댓글 생성
export const createComment = async (request) => {
  const response = await axios.post(`/v1/comments`, request);
  return response.data;
};

// 댓글 수정
export const updateComment = async ({ commentId, content }) => {
  const response = await axios.put(`/v1/comments/${commentId}`, { content });
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  await axios.delete(`/v1/comments/${commentId}`);
  return commentId;
};
