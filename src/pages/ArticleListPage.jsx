import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { fetchArticles } from "../api/articleApi";

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

// ArticleId 컴포넌트 제거

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

// ArticleStats 디자인 수정
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  background-color: ${(props) => (props.$active ? "#0066cc" : "white")};
  color: ${(props) => (props.$active ? "white" : "#333")};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.$active ? "#0055aa" : "#f8f9fa")};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// SVG 아이콘 컴포넌트 추가
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

const ArticleListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "0");
  const size = parseInt(searchParams.get("size") || "10");
  const keyword = searchParams.get("keyword") || "";

  const [searchKeyword, setSearchKeyword] = useState(keyword);

  const { data, isLoading, error } = useQuery({
    queryKey: ["articles", page, size, keyword],
    queryFn: () => fetchArticles(1, page + 1, size),
  });

  const handleSearch = () => {
    setSearchParams({ page: "0", size: String(size), keyword: searchKeyword });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: String(newPage), size: String(size), keyword });
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

  const articles = data?.articles ?? [];
  const totalPages = data?.articleCount ?? 0;

  return (
    <Container>
      <PageTitle>게시글 목록</PageTitle>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch}>검색</Button>
        <CreateButton to="/articles/new">글쓰기</CreateButton>
      </SearchBar>

      <ArticleList>
        {articles.length === 0 ? (
          <ArticleItem>
            <p>게시글이 없습니다.</p>
          </ArticleItem>
        ) : (
          articles.map((article) => (
            <ArticleItem key={article.articleId}>
              {/* <ArticleId>{article.articleId}</ArticleId> // ID 노출 제거 */}
              <ArticleContent>
                <ArticleTitle to={`/articles/${article.articleId}`}>
                  {article.title}
                </ArticleTitle>
                <ArticleMeta>
                  <span>{article.writerId}</span> ·
                  <span>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </ArticleMeta>
              </ArticleContent>
              <ArticleStats>
                <StatItem>
                  <ViewIcon /> {article.viewCount}
                </StatItem>
                <StatItem>
                  <LikeIcon /> {article.likeCount}
                </StatItem>
              </ArticleStats>
            </ArticleItem>
          ))
        )}
      </ArticleList>

      {totalPages > 0 && (
        <PaginationContainer>
          <PageButton onClick={() => handlePageChange(0)} disabled={page === 0}>
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
            if (pageNum < 0 || pageNum >= totalPages) return null;

            return (
              <PageButton
                key={pageNum}
                $active={pageNum === page}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum + 1}
              </PageButton>
            );
          })}

          <PageButton
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
          >
            다음
          </PageButton>
          <PageButton
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={page >= totalPages - 1}
          >
            마지막
          </PageButton>
        </PaginationContainer>
      )}
    </Container>
  );
};

export default ArticleListPage;
