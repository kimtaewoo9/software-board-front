// src/components/Footer.jsx
import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 2rem;
  margin-top: 3rem;
  text-align: center;
  border-top: 1px solid #e9ecef;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Copyright = styled.p`
  margin: 0;
  color: #6c757d;
`;

const Links = styled.div`
  margin: 1rem 0;

  a {
    color: #6c757d;
    margin: 0 0.5rem;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <Links>
          <a href="/terms">이용약관</a>
          <a href="/privacy">개인정보처리방침</a>
          <a href="/contact">문의하기</a>
        </Links>
        <Copyright>
          © {year} 국민대학교 소프트웨어 게시판. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
