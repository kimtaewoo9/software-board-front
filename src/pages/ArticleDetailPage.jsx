// src/pages/ArticleDetailPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { fetchArticleById, deleteArticle, likeArticle, unlikeArticle } from '../api/articleApi';
import CommentSection from '../components/CommentSection';

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
  background-color: ${props => props.liked ? '#007bff' : '#f8f9fa'};
  color: ${props => props.liked ? 'white' : '#333'};
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);

// 변경 후
    const { data: article, isLoading, error } = useQuery({
        queryKey: ['article', id],
        queryFn: () => fetchArticleById(id),
        onSuccess: (data) => {
            setLiked(data.liked);
        }
    });

  const deleteMutation = useMutation(deleteArticle, {
    onSuccess: () => {
      navigate('/articles');
    }
  });
  
  const likeMutation = useMutation(
    () => liked ? unlikeArticle(id) : likeArticle(id),
    {
      onSuccess: () => {
        setLiked(!liked);
        queryClient.invalidateQueries(['article', id]);
      }
    }
  );
  
  const handleDelete = () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleLikeToggle = () => {
    likeMutation.mutate();
  };
  
  if (isLoading) return <Container><p>로딩 중...</p></Container>;
  if (error) return <Container><p>게시글을 불러오는 데 실패했습니다.</p></Container>;
  
  const isAuthor = article.authorId === localStorage.getItem('userId');
  
  return (
    <Container>
      <Breadcrumb>
        <Link to="/">홈</Link> {'>'} <Link to="/articles">게시글</Link> {'>'} {article.title}
      </Breadcrumb>
      
      <ArticleHeader>
        <ArticleTitle>{article.title}</ArticleTitle>
        <ArticleMeta>
          <div>
            <span>작성자: {article.authorName}</span> · 
            <span>작성일: {new Date(article.createdAt).toLocaleString()}</span>
            {article.updatedAt !== article.createdAt && (
              <span> · 수정일: {new Date(article.updatedAt).toLocaleString()}</span>
            )}
          </div>
          <div>
            <span>조회수: {article.viewCount}</span> · 
            <span>좋아요: {article.likeCount}</span>
          </div>
        </ArticleMeta>
      </ArticleHeader>
      
      <ArticleContent dangerouslySetInnerHTML={{ __html: article.content }} />
      
      <ActionButtons>
        <LikeButton 
          liked={liked} 
          onClick={handleLikeToggle}
          disabled={likeMutation.isLoading}
        >
          {liked ? '좋아요 취소' : '좋아요'} ({article.likeCount})
        </LikeButton>
        
        {isAuthor && (
          <>
            <EditButton to={`/articles/${id}/edit`}>수정</EditButton>
            <DeleteButton onClick={handleDelete} disabled={deleteMutation.isLoading}>
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