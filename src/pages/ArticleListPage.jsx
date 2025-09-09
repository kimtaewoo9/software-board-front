// src/pages/ArticleListPage.jsx
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { fetchArticles, fetchArticlesCount } from "../api/articleApi";

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

const ArticleTable = styled.div`
  border-top: 2px solid #000;
  border-bottom: 1px solid #e9ecef;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 120px 120px 80px;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  padding: 0.8rem 0.5rem;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableHeader = styled(TableRow)`
  font-weight: bold;
  background-color: #f1f3f5;
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #ced4da;
  color: #495057;

  &:hover {
    background-color: #f1f3f5;
  }
`;

const TableColumn = styled.div`
  text-align: center;
  &:nth-child(2) {
    text-align: left;
    padding-left: 1rem;
  }
`;

const ArticleId = styled.div`
  text-align: center;
  color: #868e96;
`;

const ArticleTitle = styled(Link)`
  font-size: 1rem;
  color: #333;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`;

const CommentCount = styled.span`
  color: #dc3545;
  font-weight: bold;
  margin-left: 0.25rem;
`;

const Writer = styled.div`
  text-align: center;
  color: #0066cc;
`;

const CreatedAt = styled.div`
  text-align: center;
  color: #868e96;
  font-size: 0.8rem;
`;

const ViewCount = styled.div`
  text-align: center;
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

const ArticleListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "0");
  const size = parseInt(searchParams.get("size") || "10");
  const keyword = searchParams.get("keyword") || "";

  const [searchKeyword, setSearchKeyword] = useState(keyword);

  const {
    data: articlesData,
    isLoading: isArticlesLoading,
    error: articlesError,
  } = useQuery({
    queryKey: ["articles", page, size, keyword],
    queryFn: () => fetchArticles(1, page + 1, size),
  });

  const {
    data: totalCountData,
    isLoading: isCountLoading,
    error: countError,
  } = useQuery({
    queryKey: ["articlesCount"],
    queryFn: () => fetchArticlesCount(1),
  });

  const handleSearch = () => {
    setSearchParams({ page: "0", size: String(size), keyword: searchKeyword });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: String(newPage), size: String(size), keyword });
  };

  if (isArticlesLoading || isCountLoading)
    return (
      <Container>
        <p>로딩 중...</p>
      </Container>
    );
  if (articlesError || countError)
    return (
      <Container>
        <p>게시글을 불러오는 데 실패했습니다.</p>
      </Container>
    );

  const articles = articlesData?.articles ?? [];
  const totalCount = totalCountData ?? 0;
  const totalPages = Math.ceil(totalCount / size);

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

      <ArticleTable>
        <TableHeader as="header">
          <TableColumn>번호</TableColumn>
          <TableColumn>제목</TableColumn>
          <TableColumn>글쓴이</TableColumn>
          <TableColumn>작성일</TableColumn>
          <TableColumn>조회</TableColumn>
        </TableHeader>
        {articles.length === 0 ? (
          <TableRow>
            <TableColumn style={{ gridColumn: "span 5", textAlign: "center" }}>
              게시글이 없습니다.
            </TableColumn>
          </TableRow>
        ) : (
          articles.map((article, index) => (
            <TableRow key={article.articleId}>
              <ArticleId>{articles.length - index}</ArticleId>
              <ArticleTitle to={`/articles/${article.articleId}`}>
                {article.title}
                {article.articleCommentCount > 0 && (
                  <CommentCount>({article.articleCommentCount})</CommentCount>
                )}
              </ArticleTitle>
              <Writer>{article.writerId}</Writer>
              <CreatedAt>
                {new Date(article.createdAt).toLocaleDateString()}
              </CreatedAt>
              <ViewCount>{article.articleViewCount}</ViewCount>
            </TableRow>
          ))
        )}
      </ArticleTable>

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
