// src/api/articleApi.js
import axios from "./axiosConfig";

// 게시글 목록 조회
export const fetchArticles = async (
  boardId,
  page = 0,
  size = 10,
  type,
  keyword
) => {
  const params = { boardId, page, pageSize: size, type, keyword };
  const response = await axios.get("/v1/articles", { params });
  return response.data;
};

// 단일 게시글 조회
export const fetchArticleById = async (id) => {
  const response = await axios.get(`/v1/articles/${id}`);
  return response.data;
};

// 게시글 총 개수 조회
export const fetchArticlesCount = async (boardId) => {
  const response = await axios.get(`/v1/articles/boards/${boardId}/count`);
  return response.data;
};

// 게시글 생성
export const createArticle = async (articleData, files) => {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(articleData)], { type: "application/json" })
  );
  if (files && files.length > 0) {
    files.forEach((file) => formData.append("files", file));
  }

  const response = await axios.post("/v1/articles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 게시글 수정 (백엔드 RequestPart에 맞춰 수정)
export const updateArticle = async (
  articleId,
  articleData,
  newFiles = [],
  deletedFileIds = []
) => {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(articleData)], { type: "application/json" })
  );
  if (newFiles && newFiles.length > 0) {
    newFiles.forEach((file) => formData.append("newFiles", file));
  }
  if (deletedFileIds && deletedFileIds.length > 0) {
    deletedFileIds.forEach((id) => formData.append("deletedFileIds", id));
  }

  const response = await axios.put(`/v1/articles/${articleId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 게시글 삭제
export const deleteArticle = async (id) => {
  await axios.delete(`/v1/articles/${id}`);
  return id;
};
