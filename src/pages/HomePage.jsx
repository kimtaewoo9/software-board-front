
// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { fetchHotArticles } from '../api/articleApi';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem 0;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 2rem;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #0066cc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  
  &:hover {
    background-color: #0055aa;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ArticleCard = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ArticleTitle = styled(Link)`
  display: block;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
  text-decoration: none;
  
  &:hover {
    color: #0066cc;
  }
`;

const ArticleMeta = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
`;

const ArticleExcerpt = styled.p`
  color: #495057;
  margin-bottom: 1rem;
`;

const HomePage = () => {
    const { data: hotArticles, isLoading, error } = useQuery({
        queryKey: ['hotArticles'],
        queryFn: fetchHotArticles
    });

    return (
        <HomeContainer>
            <Hero>
                <HeroTitle>KUKE 게시판에 오신 것을 환영합니다</HeroTitle>
                <HeroSubtitle>다양한 주제의 게시글을 둘러보고 의견을 나눠보세요</HeroSubtitle>
                <Button to="/articles">게시글 둘러보기</Button>
            </Hero>

            <section>
                <SectionTitle>인기 게시글</SectionTitle>
                {isLoading ? (
                    <p>로딩 중...</p>
                ) : error ? (
                    <p>인기 게시글을 불러오는 데 실패했습니다.</p>
                ) : (
                    <ArticleGrid>
                        {hotArticles?.map(article => (
                            <ArticleCard key={article.id}>
                                <ArticleTitle to={`/articles/${article.id}`}>{article.title}</ArticleTitle>
                                <ArticleMeta>
                                    <span>{article.authorName}</span> ·
                                    <span>{new Date(article.createdAt).toLocaleDateString()}</span> ·
                                    <span>조회 {article.viewCount}</span>
                                </ArticleMeta>
                                <ArticleExcerpt>{article.content.substring(0, 100)}...</ArticleExcerpt>
                                <Button to={`/articles/${article.id}`}>자세히 보기</Button>
                            </ArticleCard>
                        ))}
                    </ArticleGrid>
                )}
            </section>
        </HomeContainer>
    );
};

export default HomePage;