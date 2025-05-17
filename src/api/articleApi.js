// src/api/articleApi.js
import axios from './axiosConfig';

// 게시글 목록 조회
export const fetchArticles = async (page = 0, size = 10, keyword = '') => {
  const params = { page, size };
  if (keyword) params.keyword = keyword;
  
  const response = await axios.get('/articles', { params });
  return response.data;
};

// 인기 게시글 조회
export const fetchHotArticles = async () => {
  const response = await axios.get('/articles/hot');
  return response.data;
};

// 단일 게시글 조회
export const fetchArticleById = async (id) => {
  const response = await axios.get(`/articles/${id}`);
  return response.data;
};

// 게시글 생성
export const createArticle = async (articleData) => {
  const response = await axios.post('/articles', articleData);
  return response.data;
};

// 게시글 수정
export const updateArticle = async ({ id, ...articleData }) => {
  const response = await axios.put(`/articles/${id}`, articleData);
  return response.data;
};

// 게시글 삭제
export const deleteArticle = async (id) => {
  await axios.delete(`/articles/${id}`);
  return id;
};

// 게시글 좋아요
export const likeArticle = async (id) => {
  const response = await axios.post(`/articles/${id}/like`);
  return response.data;
};

// 게시글 좋아요 취소
export const unlikeArticle = async (id) => {
  const response = await axios.delete(`/articles/${id}/like`);
  return response.data;
};