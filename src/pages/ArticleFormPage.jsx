import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import {
  fetchArticleById,
  createArticle,
  updateArticle,
} from "../api/articleApi";

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

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 0.5rem;
`;

const FileItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  span {
    font-size: 0.9rem;
    color: #555;
  }

  button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const ArticleFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [deletedFileIds, setDeletedFileIds] = useState([]);
  const [errors, setErrors] = useState({});

  const { data: article, isLoading: isArticleLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticleById(id),
    enabled: isEditMode,
    onSuccess: (data) => {
      setTitle(data.title);
      setContent(data.content);
      if (data.files) {
        setExistingFiles(data.files);
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: ({ articleData, files }) => createArticle(articleData, files),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate(`/articles/${data.articleId}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, articleData, newFiles, deletedFileIds }) =>
      updateArticle(id, articleData, newFiles, deletedFileIds),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["articles", id] });
      queryClient.invalidateQueries({ queryKey: ["article", id] });
      navigate(`/articles/${data.articleId}`);
    },
  });

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "제목을 입력해주세요";
    }
    if (!content.trim()) {
      newErrors.content = "내용을 입력해주세요";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✨ 이 부분을 수정하여 validateForm() 함수를 호출합니다.
    if (!validateForm()) {
      return;
    }

    const articleData = {
      title: title.trim(),
      content: content.trim(),
      boardId: 1,
    };

    if (isEditMode) {
      updateMutation.mutate({
        id,
        articleData,
        newFiles: files,
        deletedFileIds,
      });
    } else {
      createMutation.mutate({ articleData, files });
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleFileDelete = (fileId) => {
    setDeletedFileIds([...deletedFileIds, fileId]);
    setExistingFiles(existingFiles.filter((file) => file.id !== fileId));
  };

  useEffect(() => {
    if (
      isEditMode &&
      article &&
      article.authorId !== parseInt(localStorage.getItem("userId"))
    ) {
      alert("본인이 작성한 글만 수정할 수 있습니다.");
      navigate(`/articles/${id}`);
    }
  }, [article, id, isEditMode, navigate]);

  if (isEditMode && isArticleLoading) {
    return (
      <Container>
        <p>로딩 중...</p>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>{isEditMode ? "게시글 수정" : "새 게시글 작성"}</PageTitle>

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

        <FormGroup>
          <Label htmlFor="file">파일 첨부</Label>
          <Input type="file" id="file" multiple onChange={handleFileChange} />
        </FormGroup>

        {isEditMode && existingFiles.length > 0 && (
          <FormGroup>
            <Label>첨부된 파일</Label>
            <FileList>
              {existingFiles.map((file) => (
                <FileItem key={file.id}>
                  <span>{file.originalFileName}</span>
                  <button
                    type="button"
                    onClick={() => handleFileDelete(file.id)}
                  >
                    삭제
                  </button>
                </FileItem>
              ))}
            </FileList>
          </FormGroup>
        )}

        {files.length > 0 && (
          <FormGroup>
            <Label>새로 첨부될 파일</Label>
            <FileList>
              {files.map((file) => (
                <FileItem key={file.name}>
                  <span>{file.name}</span>
                </FileItem>
              ))}
            </FileList>
          </FormGroup>
        )}

        <ButtonGroup>
          <SubmitButton
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditMode ? "수정하기" : "등록하기"}
          </SubmitButton>
          <CancelButton to={isEditMode ? `/articles/${id}` : "/articles"}>
            취소
          </CancelButton>
        </ButtonGroup>
      </form>
    </Container>
  );
};

export default ArticleFormPage;
