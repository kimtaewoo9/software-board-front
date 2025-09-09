import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled, { keyframes, css } from "styled-components";
import { fetchArticleById, deleteArticle } from "../api/articleApi";
import { likeArticle, unlikeArticle } from "../api/likeApi";
import { increaseArticleViewCount } from "../api/viewApi";
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
  justify-content: center;
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

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const LikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  background-color: ${(props) => (props.$liked ? "#007bff" : "#f8f9fa")};
  color: ${(props) => (props.$liked ? "white" : "#333")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.$liked ? "#0055aa" : "#e9ecef")};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  ${(props) =>
    props.$liked &&
    css`
      svg {
        animation: ${pulse} 0.3s ease-out;
        fill: #ffffff;
      }
    `}
`;

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

const LikeIcon = ({ liked }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill={liked ? "#FFFFFF" : "currentColor"}
  >
    <path d="M32 448c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c53 0 96-43 96-96V128c0-17.7-14.3-32-32-32s-32 14.3-32 32v224c0 17.7-14.3 32-32 32H32zM128 160c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H192c-35.3 0-64-28.7-64-64V160zm112 80V320h64V240c0-17.7-14.3-32-32-32s-32 14.3-32 32z" />
  </svg>
);

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
`;

const ModalButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ModalMessage = styled.p`
  margin-bottom: 1.5rem;
`;

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(null);

  const userId = localStorage.getItem("userId");
  const viewCountIncremented = useRef({});

  // 조회수 증가 뮤테이션을 먼저 선언
  const viewCountMutation = useMutation({
    mutationFn: (articleId) => increaseArticleViewCount(articleId),
    onSuccess: () => {
      // 조회수 증가 API 호출 성공 후, 게시글 상세 정보 캐시를 무효화
      queryClient.invalidateQueries({ queryKey: ["article", id, userId] });
    },
    onError: (err) => {
      console.error("조회수 증가 실패:", err);
      setModalMessage("조회수 증가에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setShowModal(true);
    },
  });

  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", id, userId],
    queryFn: () => fetchArticleById(id),
    enabled: !!id,
    onSuccess: (data) => {
      setLiked(data.isLikedByUser);
      setCurrentLikeCount(data.likeCount);
    },
  });

  useEffect(() => {
    // article 데이터가 있고, 조회수 증가 요청이 아직 이루어지지 않았다면
    if (id && article && !viewCountIncremented.current[id]) {
      viewCountMutation.mutate(id);
      viewCountIncremented.current[id] = true;
    }
  }, [id, article, viewCountMutation]);

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      setShowModal(false);
      navigate("/articles");
    },
    onError: () => {
      setShowModal(false);
      setModalMessage("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
      setShowModal(true);
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => {
      const userIdentifier = userId || "anonymous-user";
      return liked
        ? unlikeArticle(id, userIdentifier)
        : likeArticle(id, userIdentifier);
    },
    onSuccess: () => {
      setLiked((prev) => !prev);
      setCurrentLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      queryClient.invalidateQueries({ queryKey: ["article", id, userId] });
    },
    onError: (err) => {
      console.error("좋아요 처리 실패:", err);
      setModalMessage("좋아요 처리에 실패했습니다. 다시 시도해주세요.");
      setShowModal(true);
    },
  });

  const handleDelete = () => {
    setModalMessage("정말로 이 게시글을 삭제하시겠습니까?");
    setModalAction(() => () => deleteMutation.mutate(id));
    setShowModal(true);
  };

  const handleLikeToggle = () => {
    likeMutation.mutate();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalAction(null);
  };

  const handleConfirmModal = () => {
    if (modalAction) {
      modalAction();
    }
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

  const isAuthor = article.authorId === userId;

  return (
    <Container>
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalMessage>{modalMessage}</ModalMessage>
            {modalAction ? (
              <div>
                <ModalButton onClick={handleConfirmModal}>확인</ModalButton>
                <ModalButton onClick={handleCloseModal}>취소</ModalButton>
              </div>
            ) : (
              <ModalButton onClick={handleCloseModal}>닫기</ModalButton>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

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
              <ViewIcon /> {article.articleViewCount}
            </StatItem>
            <StatItem>
              <LikeIcon liked={liked} /> {currentLikeCount}
            </StatItem>
          </ArticleStats>
        </ArticleMeta>
      </ArticleHeader>

      <ArticleContent dangerouslySetInnerHTML={{ __html: article.content }} />

      <ActionButtons>
        <LikeButton
          $liked={liked}
          onClick={handleLikeToggle}
          disabled={likeMutation.isPending}
        >
          <LikeIcon liked={liked} />
          {liked ? "좋아요 취소" : "좋아요"} ({currentLikeCount})
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
