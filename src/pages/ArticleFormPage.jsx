// src/pages/ArticleFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import { fetchArticleById, createArticle, updateArticle } from '../api/articleApi';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    border-color: #0066cc;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 300px;
  
  &:focus {
    border-color: #0066cc;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #0066cc;
  color: white;
  
  &:hover {
    background-color: #0055aa;
  }
`;

const CancelButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  
  &:hover {
    background-color: #5a6268;
    color: white;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const ArticleFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  
  const { data: article, isLoading: isArticleLoading } = useQuery(
    ['article', id],
    () => fetchArticleById(id),
    {
      enabled: isEditMode,
      onSuccess: (data) => {
        setTitle(data.title);
        setContent(data.content);
      }
    }
  );
  
  const createMutation = useMutation(createArticle, {
    onSuccess: (data) => {
      navigate(`/articles/${data.id}`);
    }
  });
  
  const updateMutation = useMutation(updateArticle, {
    onSuccess: (data) => {
      navigate(`/articles/${data.id}`);
    }
  });
  
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }
    if (!content.trim()) {
      newErrors.content = '내용을 입력해주세요';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const articleData = {
      title: title.trim(),
      content: content.trim()
    };
    
    if (isEditMode) {
      updateMutation.mutate({ id, ...articleData });
    } else {
      createMutation.mutate(articleData);
    }
  };
  
  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login', { state: { from: `/articles/${isEditMode ? `${id}/edit` : 'new'}` } });
    }
  }, [navigate, id, isEditMode]);
  
  // 수정 모드에서 본인 글이 아닌 경우 처리
  useEffect(() => {
    if (isEditMode && article && article.authorId !== parseInt(localStorage.getItem('userId'))) {
      alert('본인이 작성한 글만 수정할 수 있습니다.');
      navigate(`/articles/${id}`);
    }
  }, [article, id, isEditMode, navigate]);
  
  if (isEditMode && isArticleLoading) {
    return <Container><p>로딩 중...</p></Container>;
  }
  
  return (
    <Container>
      <PageTitle>{isEditMode ? '게시글 수정' : '새 게시글 작성'}</PageTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">제목</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="content">내용</Label>
          <TextArea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
          />
          {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
        </FormGroup>
        
        <ButtonGroup>
          <SubmitButton 
            type="submit" 
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {isEditMode ? '수정하기' : '등록하기'}
          </SubmitButton>
          <CancelButton to={isEditMode ? `/articles/${id}` : '/articles'}>
            취소
          </CancelButton>
        </ButtonGroup>
      </form>
    </Container>
  );
};

export default ArticleFormPage;