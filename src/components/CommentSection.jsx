// src/components/CommentSection.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "../api/commentApi";

const CommentContainer = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
`;

const CommentTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
`;

const CommentForm = styled.form`
  margin-bottom: 2rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #0055aa;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const CommentList = styled.div`
  margin-top: 1.5rem;
`;

const CommentItem = styled.div`
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 0;

  &:last-child {
    border-bottom: none;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  color: #333;
`;

const CommentDate = styled.span`
  color: #6c757d;
  font-size: 0.85rem;
`;

const CommentBody = styled.div`
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.85rem;
`;

const CommentButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  font-size: 0.85rem;

  &:hover {
    color: #0066cc;
    text-decoration: underline;
  }
`;

const EditForm = styled.div`
  margin-top: 0.5rem;
`;

const CommentSection = ({ articleId }) => {
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => fetchComments(articleId),
  });

  const comments = data?.comments ?? [];

  const createMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      setContent("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      setEditingId(null);
      setEditContent("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    createMutation.mutate({
      articleId,
      content,
    });
  };

  const handleEdit = (comment) => {
    setEditingId(comment.commentId); // ✨ comment.id -> comment.commentId
    setEditContent(comment.content);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    updateMutation.mutate({
      id: editingId,
      content: editContent,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const userId = localStorage.getItem("userId");

  return (
    <CommentContainer>
      <CommentTitle>댓글 {comments?.length || 0}개</CommentTitle>

      <CommentForm onSubmit={handleSubmit}>
        <TextArea
          placeholder="댓글을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <SubmitButton
          type="submit"
          disabled={createMutation.isPending || !content.trim()}
        >
          댓글 작성
        </SubmitButton>
      </CommentForm>

      {isLoading ? (
        <p>댓글을 불러오는 중...</p>
      ) : (
        <CommentList>
          {comments?.length === 0 ? (
            <p>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
          ) : (
            comments?.map((comment) => (
              <CommentItem key={comment.commentId}>
                {" "}
                {/* ✨ comment.id -> comment.commentId */}
                <CommentHeader>
                  <CommentAuthor>{comment.authorName}</CommentAuthor>
                  <CommentDate>
                    {new Date(comment.createdAt).toLocaleString()}
                  </CommentDate>
                </CommentHeader>
                {editingId === comment.commentId ? ( // ✨ comment.id -> comment.commentId
                  <EditForm>
                    <TextArea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      required
                    />
                    <SubmitButton
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending || !editContent.trim()}
                    >
                      수정 완료
                    </SubmitButton>
                    <CommentButton onClick={() => setEditingId(null)}>
                      취소
                    </CommentButton>
                  </EditForm>
                ) : (
                  <>
                    <CommentBody>{comment.content}</CommentBody>
                    {userId === String(comment.authorId) && (
                      <CommentActions>
                        <CommentButton onClick={() => handleEdit(comment)}>
                          수정
                        </CommentButton>
                        <CommentButton
                          onClick={() => handleDelete(comment.commentId)}
                        >
                          {" "}
                          {/* ✨ comment.id -> comment.commentId */}
                          삭제
                        </CommentButton>
                      </CommentActions>
                    )}
                  </>
                )}
              </CommentItem>
            ))
          )}
        </CommentList>
      )}
    </CommentContainer>
  );
};

export default CommentSection;
