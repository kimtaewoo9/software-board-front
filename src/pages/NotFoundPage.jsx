// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 6rem;
  margin: 0;
  color: #0066cc;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  margin: 1rem 0;
  color: #333;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #6c757d;
`;

const HomeButton = styled(Link)`
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

const NotFoundPage = () => {
  return (
    <Container>
      <Title>404</Title>
      <Subtitle>페이지를 찾을 수 없습니다</Subtitle>
      <Message>
        요청하신 페이지가 삭제되었거나, 이름이 변경되었거나, 일시적으로 사용이 중단되었습니다.
      </Message>
      <HomeButton to="/">홈으로 돌아가기</HomeButton>
    </Container>
  );
};

export default NotFoundPage;