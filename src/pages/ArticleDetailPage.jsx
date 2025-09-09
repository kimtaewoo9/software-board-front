// src/pages/ArticleDetailPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { fetchArticleById, deleteArticle } from "../api/articleApi";
import { likeArticle, unlikeArticle } from "../api/likeApi";
import CommentSection from "../components/CommentSection";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const Breadcrumb = styled.div`
  margin-bottom: 1rem;
  color: #6c757d;

  a {
    color: #6c757d;
    text-decoration: none;

    &:hover {
      color: #0066cc;
      text-decoration: underline;
    }
  }
`;

const ArticleHeader = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1.5rem;
`;

const ArticleTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ArticleMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ArticleContent = styled.div`
  line-height: 1.8;
  color: #333;
  margin-bottom: 2rem;
  min-height: 200px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`;

const EditButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  border-radius: 4px;

  &:hover {
    background-color: #5a6268;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;

  &:hover {
    background-color: #c82333;
  }
`;

const LikeButton = styled(Button)`
  background-color: ${(props) => (props.liked ? "#007bff" : "#f8f9fa")};
  color: ${(props) => (props.liked ? "white" : "#333")};
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// ✨ ArticleListPage에서 가져온 새로운 컴포넌트 정의
const ArticleStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
  align-items: center;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  svg {
    fill: currentColor;
    width: 16px;
    height: 16px;
  }
`;

const ViewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
    fill="currentColor"
  >
    <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.6C89.2 182.7 72 234.3 72 288c0 53.7 17.2 105.3 43.1 140.4C169.2 482.4 222.8 512 288 512s118.8-29.6 159.9-67.6C486.8 393.3 504 341.7 504 288c0-53.7-17.2-105.3-43.1-140.4C406.8 109.6 353.2 80 288 80zm0 32a128 128 0 1 1 0 256 128 128 0 1 1 0-256zm0 160a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
  </svg>
);

const LikeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
  >
    <path d="M32 448c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c53 0 96-43 96-96V128c0-17.7-14.3-32-32-32s-32 14.3-32 32v224c0 17.7-14.3 32-32 32H32zM128 160c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H192c-35.3 0-64-28.7-64-64V160zm112 80V320h64V240c0-17.7-14.3-32-32-32s-32 14.3-32 32z" />
  </svg>
);

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);

  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticleById(id),
    enabled: !!id,
    onSuccess: (data) => {
      setLiked(data.liked);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      navigate("/articles");
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => (liked ? unlikeArticle(id) : likeArticle(id)),
    onSuccess: () => {
      setLiked(!liked);
      queryClient.invalidateQueries({ queryKey: ["article", id] });
    },
  });

  const handleDelete = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleLikeToggle = () => {
    likeMutation.mutate();
  };

  if (isLoading)
    return (
      <Container>
        <p>로딩 중...</p>
      </Container>
    );
  if (error)
    return (
      <Container>
        <p>게시글을 불러오는 데 실패했습니다.</p>
      </Container>
    );

  const isAuthor = article.authorId === localStorage.getItem("userId");

  return (
    <Container>
      <Breadcrumb>
        <Link to="/">홈</Link> {">"} <Link to="/articles">게시글</Link> {">"}{" "}
        {article.title}
      </Breadcrumb>

      <ArticleHeader>
        <ArticleTitle>{article.title}</ArticleTitle>
        <ArticleMeta>
          <div>
            <span>작성자: {article.authorName}</span> ·
            <span>작성일: {new Date(article.createdAt).toLocaleString()}</span>
            {article.updatedAt !== article.createdAt && (
              <span>
                {" "}
                · 수정일: {new Date(article.updatedAt).toLocaleString()}
              </span>
            )}
          </div>
          <ArticleStats>
            <StatItem>
              <ViewIcon /> {article.viewCount}
            </StatItem>
            <StatItem>
              <LikeIcon /> {article.likeCount}
            </StatItem>
          </ArticleStats>
        </ArticleMeta>
      </ArticleHeader>

      <ArticleContent dangerouslySetInnerHTML={{ __html: article.content }} />

      <ActionButtons>
        <LikeButton
          liked={liked}
          onClick={handleLikeToggle}
          disabled={likeMutation.isPending}
        >
          {liked ? "좋아요 취소" : "좋아요"} ({article.likeCount})
        </LikeButton>

        {isAuthor && (
          <>
            <EditButton to={`/articles/${id}/edit`}>수정</EditButton>
            <DeleteButton
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              삭제
            </DeleteButton>
          </>
        )}
      </ActionButtons>

      <CommentSection articleId={id} />
    </Container>
  );
};

export default ArticleDetailPage;
