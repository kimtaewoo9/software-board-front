// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  
  &:hover {
    color: #0066cc;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #555;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #0066cc;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #0055aa;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') !== null;
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  
  return (
    <HeaderContainer>
      <Logo to="/">KUKE 게시판</Logo>
      <Nav>
        <NavLink to="/">홈</NavLink>
        <NavLink to="/articles">게시글</NavLink>
        {isLoggedIn ? (
          <>
            <NavLink to="/my-page">내 프로필</NavLink>
            <Button onClick={handleLogout}>로그아웃</Button>
          </>
        ) : (
          <>
            <NavLink to="/login">로그인</NavLink>
            <NavLink to="/register">회원가입</NavLink>
          </>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;