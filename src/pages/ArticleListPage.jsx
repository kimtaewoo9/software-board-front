// src/pages/ArticleListPage.jsx
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { fetchArticles } from '../api/articleApi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const SearchBar = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #0055aa;
  }
`;

const CreateButton = styled(Link)`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  margin-left: auto;
  
  &:hover {
    background-color: #218838;
  }
`;

const ArticleList = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
`;

const ArticleItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const ArticleId = styled.span`
  width: 60px;
  text-align: center;
  color: #6c757d;
`;

const ArticleContent = styled.div`
  flex: 1;
`;

const ArticleTitle = styled(Link)`
  display: block;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin-bottom: 0.25rem;
  
  &:hover {
    color: #0066cc;
  }
`;

const ArticleMeta = styled.div`
  font-size: 0.85rem;
  color: #6c757d;
`;

const ArticleStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  background-color: ${props => props.active ? '#0066cc' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#0055aa' : '#f8f9fa'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ArticleListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '0');
  const size = parseInt(searchParams.get('size') || '10');
  const keyword = searchParams.get('keyword') || '';
  
  const [searchKeyword, setSearchKeyword] = useState(keyword);

// 변경 후
  const { data, isLoading, error } = useQuery({
    queryKey: ['articles', page, size, keyword],
    queryFn: () => fetchArticles(page, size, keyword)
  });

  
  const handleSearch = () => {
    setSearchParams({ page: '0', size: String(size), keyword: searchKeyword });
  };
  
  const handlePageChange = (newPage) => {
    setSearchParams({ page: String(newPage), size: String(size), keyword });
  };
  
  if (isLoading) return <Container><p>로딩 중...</p></Container>;
  if (error) return <Container><p>게시글을 불러오는 데 실패했습니다.</p></Container>;
  
  return (
    <Container>
      <PageTitle>게시글 목록</PageTitle>
      
      <SearchBar>
        <SearchInput
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>검색</Button>
        <CreateButton to="/articles/new">글쓰기</CreateButton>
      </SearchBar>
      
      <ArticleList>
        {data?.content.length === 0 ? (
          <ArticleItem>
            <p>게시글이 없습니다.</p>
          </ArticleItem>
        ) : (
          data?.content.map(article => (
            <ArticleItem key={article.id}>
              <ArticleId>{article.id}</ArticleId>
              <ArticleContent>
                <ArticleTitle to={`/articles/${article.id}`}>
                  {article.title}
                  {article.commentCount > 0 && ` [${article.commentCount}]`}
                </ArticleTitle>
                <ArticleMeta>
                  <span>{article.authorName}</span> · 
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </ArticleMeta>
              </ArticleContent>
              <ArticleStats>
                <span>👁️ {article.viewCount}</span>
                <span>👍 {article.likeCount}</span>
              </ArticleStats>
            </ArticleItem>
          ))
        )}
      </ArticleList>
      
      <PaginationContainer>
        <PageButton 
          onClick={() => handlePageChange(0)} 
          disabled={page === 0}
        >
          처음
        </PageButton>
        <PageButton 
          onClick={() => handlePageChange(page - 1)} 
          disabled={page === 0}
        >
          이전
        </PageButton>
        
        {[...Array(5)].map((_, i) => {
          const pageNum = page - 2 + i;
          if (pageNum < 0 || pageNum >= data.totalPages) return null;
          
          return (
            <PageButton
              key={pageNum}
              active={pageNum === page}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum + 1}
            </PageButton>
          );
        })}
        
        <PageButton 
          onClick={() => handlePageChange(page + 1)} 
          disabled={page >= data.totalPages - 1}
        >
          다음
        </PageButton>
        <PageButton 
          onClick={() => handlePageChange(data.totalPages - 1)} 
          disabled={page >= data.totalPages - 1}
        >
          마지막
        </PageButton>
      </PaginationContainer>
    </Container>
  );
};

export default ArticleListPage;