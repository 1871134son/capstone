import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostByNoFromFirebase, deletePostFromFirebase, updatePostInFirebase, addCommentToPost, getCommentsByPostNo, deleteCommentFromFirebase, updateCommentInFirebase } from '../../firebase/firebase.js';
import dateFormat from 'dateformat';
import Button from "react-bootstrap/Button";
import './Post.css';
import { getUserName } from '../../firebase/firebase.js';

const PostView = () => {
  const [data, setData] = useState({});
  const { brdno } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // 게시물 수정 상태
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getPostByNoFromFirebase(brdno);
        setData(postData);

        // 초기화
        setEditedTitle(postData.title);
        setEditedContent(postData.content);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchData();
  }, [brdno]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userName = await getUserName();
        setCurrentUser(userName);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleDelete = async () => {
    try {
      await deletePostFromFirebase(brdno);
      navigate('/postlist');
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePostInFirebase(brdno, { title: editedTitle, content: editedContent });
      setEditing(false);
    } catch (error) {
      console.error('게시물 수정 오류:', error);
    }
  };

  const formatDate = date => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getCommentsByPostNo(brdno);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [brdno]);

  const handleAddComment = async () => {
    try {
      await addCommentToPost(brdno, newComment);
      setNewComment('');
      const commentsData = await getCommentsByPostNo(brdno);
      setComments(commentsData);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentDocId) => {
    try {
      await deleteCommentFromFirebase(commentDocId);
      const updatedComments = comments.filter(comment => comment.id !== commentDocId);
      setComments(updatedComments);
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  const startEditingComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(content);
  };

  const handleUpdateComment = async () => {
    try {
      await updateCommentInFirebase(editingCommentId, { content: editedCommentContent });
      const updatedComments = comments.map(comment =>
        comment.id === editingCommentId ? { ...comment, content: editedCommentContent } : comment
      );
      setComments(updatedComments);
      setEditingCommentId(null);
      setEditedCommentContent('');
    } catch (error) {
      console.error('댓글 수정 오류:', error);
    }
  };

  return (
    <>
      <h2 align="center">게시글 상세정보</h2>
      <div className="post-view-wrapper">
        {data ? (
          <>
            <div className="post-view-info">
              <div className="post-view-row">
                <label>게시글 번호</label>
                <label>{data.brdno}</label>
              </div>
              <div className="post-view-row">
                <label>작성자</label>
                <label>{data.brdwriter}</label>
              </div>
              <div className="post-view-row">
                <label>작성일</label>
                <label>{dateFormat(data.brddate, "yyyy-mm-dd")}</label>
              </div>
            </div>
            <div className="post-view-content">
              <div className="post-view-row">
                <label>제목</label>
                {editing ? (
                  <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                ) : (
                  <label>{data.title}</label>
                )}
              </div>
              <div className="post-view-row">
                <label>내용</label>
                {editing ? (
                  <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                ) : (
                  <div>{data.content}</div>
                )}
              </div>
            </div>
          </>
        ) : (
          '해당 게시글을 찾을 수 없습니다.'
        )}
        <div className="post-view-actions">
          <button className="post-view-go-list-btn" onClick={() => navigate(-1)}>목록으로 돌아가기</button>
          {currentUser === data.brdwriter && (
            editing ? (
              <Button variant="success" className="post-view-go-list-btn1" onClick={handleUpdate}>저장</Button>
            ) : (
              <Button variant="success" className="post-view-go-list-btn1" onClick={() => setEditing(true)}>수정</Button>
            )
          )}
          {currentUser === data.brdwriter && (
            <Button variant="danger" className="post-view-go-list-btn1" onClick={handleDelete}>삭제</Button>
          )}
        </div>
      </div>

      <div className="comments-section">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            {editingCommentId === comment.id ? (
              <>
                <input
                  type="text"
                  value={editedCommentContent}
                  onChange={(e) => setEditedCommentContent(e.target.value)}
                />
                <button onClick={handleUpdateComment}>저장</button>
                <button onClick={() => setEditingCommentId(null)}>취소</button>
              </>
            ) : (
              <>
                <p>{comment.commenter}</p>
                <p>{comment.content}</p>
                <p>{formatDate(comment.date)}</p>
                <p>================</p>
                {currentUser === comment.commenter && (
                  <>
                    <button onClick={() => startEditingComment(comment.id, comment.content)}>수정</button>
                    <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
        <div className="comment-input-container">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="comment-input"
          />
          <button onClick={handleAddComment} className="comment-button">등록</button>
        </div>
      </div>
    </>
  );
};

export default PostView;
