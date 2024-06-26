import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostByNoFromFirebase, deletePostFromFirebase, updatePostInFirebase, addCommentToPost,
         getCommentsByPostNo, deleteCommentFromFirebase, updateCommentInFirebase } from '../../firebase/firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import dateFormat from 'dateformat';
import './Post.css';


const PostView = () => {
  const [data, setData] = useState({});
  const { postId } = useParams();
  const navigate = useNavigate();

  const [currentUserUID, setCurrentUserUID] = useState(null);

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
        const postData = await getPostByNoFromFirebase(postId);
        setData(postData);
        console.log('포스트데이터:', postData);
        // 초기화
        setEditedTitle(postData.title);
        setEditedContent(postData.content);
        
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchData();
  }, [postId]);





  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUID(user.uid);
        console.log("유저 UID:", user.uid);
      } else {
        setCurrentUserUID(null);
      }
    });

    return () => unsubscribe();
  }, []);



  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말 이 게시물을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const commentsData = await getCommentsByPostNo(postId);
      for (const comment of commentsData) {
        await deleteCommentFromFirebase(comment.id);
      }
      await deletePostFromFirebase(postId);
      navigate('/postlist');
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
    }
  };


  const handleUpdate = async () => {
    try {
      await updatePostInFirebase(postId, { title: editedTitle, content: editedContent });
      // 상태를 업데이트하여 수정된 제목과 내용을 반영
      setData(prevData => ({
        ...prevData,
        title: editedTitle,
        content: editedContent
      }));
      setEditing(false);
    } catch (error) {
      console.error('게시물 수정 오류:', error);
    }
  };


  //test
  // const handleUpdate = async () => {
  //   try {
  //     const updatedDate = new Date.now(); // 현재 날짜 가져오기
  //     await updatePostInFirebase(postId, { title: editedTitle, content: editedContent, brddate: dateFormat(updatedDate, "yyyy-mm-dd") });
      
  //     // 상태를 업데이트하여 수정된 제목, 내용, 날짜를 반영
  //     setData(prevData => ({
  //       ...prevData,
  //       title: editedTitle,
  //       content: editedContent,
  //       date: updatedDate
  //     }));
  //     setEditing(false);
  //   } catch (error) {
  //     console.error('게시물 수정 오류:', error);
  //   }
  // };

  //--------------------------------------------------------------------------댓글(시작)------------------------------------------------------------------------------
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getCommentsByPostNo(postId);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [postId]);



  const handleAddComment = async () => {
    try {
      await addCommentToPost(postId, newComment);
      setNewComment('');
      const commentsData = await getCommentsByPostNo(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };



  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm('정말 이 댓글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await deleteCommentFromFirebase(commentId);
      const updatedComments = comments.filter(comment => comment.id !== commentId);
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


  //test
  // const handleUpdateComment = async () => {
  //   try {
  //     const updatedDate = new Date();
  //     await updateCommentInFirebase(editingCommentId, { content: editedCommentContent, date: updatedDate });
  //     const updatedComments = comments.map(comment =>
  //       comment.id === editingCommentId ? { ...comment, content: editedCommentContent, date: updatedDate } : comment
  //     );
  //     setComments(updatedComments);
  //     setEditingCommentId(null);
  //     setEditedCommentContent('');
  //   } catch (error) {
  //     console.error('댓글 수정 오류:', error);
  //   }
  // };

  
  
  
//--------------------------------------------------------------------------댓글(종료)------------------------------------------------------------------------------

  return (
    <>
    <div className='post-main'>
      <h2 align="center">게시글 상세정보</h2>
      <div className="post-view-wrapper">
        {data ? (
          <>
            <div className="post-view-info">
              <div className="post-view-row">
                <label>게 시 글 번호</label>
                <label>{data.brdno}</label>
              </div>
              <div className="post-view-row">
                <label>작 성 자</label>
                <label>{data.brdwriter}</label>
              </div>
              <div className="post-view-row">
                <label>작 성 일</label>
                <label>{dateFormat(data.brddate, "yyyy-mm-dd")}</label>
              </div>
            </div>

            

            <div className="post-view-content">
              <div className="post-view-row">
                <label>제 목</label>
                {editing ? (
                  <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                ) : (
                  <label>{data.title}</label>
                )}
              </div>
              <div className="post-view-row">
                <label>내 용</label>
                {editing ? (
                  <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
                ) : (
                  <label>{data.content}</label>
                )}
              </div>
              </div>

            {data.photoURL && ( // 사진 URL이 존재하는 경우에만 이미지 표시
              <div className="post-view-row">
                <label>이 미 지</label>
                <img src={data.photoURL} alt="게시글 사진" className="post-view-photo" />
              </div>
            )}
            
          </>
        ) : (
          '해당 게시글을 찾을 수 없습니다.'
        )}
        </div>
        <div className="post-view-actions">
          <button className="post-view-go-list-btn" onClick={() => navigate(-1)}>목록</button>
          {currentUserUID === data.uid && (
            
            editing ? (
              <button className="post-view-go-list-btn1" onClick={handleUpdate}>저장</button>
            ) : (
              <button className="post-view-go-list-btn1" onClick={() => setEditing(true)}>수정</button>
            )
          )}
          {currentUserUID === data.uid && (
            <button className="post-view-go-list-btn1" onClick={handleDelete}>삭제</button>
          )}
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
                <div class="button-container">
                <button onClick={handleUpdateComment}>저장</button>
                <button onClick={() => setEditingCommentId(null)}>취소</button>
                </div>
              </>
            ) : (
              <>
                <p>작성자 : {comment.commenter}</p>
                <p>내 용 : {comment.content}</p>
                <p>작성일 : {dateFormat(comment.date, "yyyy-mm-dd")}</p>
                

                {currentUserUID === comment.uid && (
                  <>
                  <div class="button-container">
                    <button onClick={() => startEditingComment(comment.id, comment.content)}>수정</button>
                    <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                    </div>
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
          <button onClick={handleAddComment} className="comment-button">등 록</button>
        </div>
      </div>
      </div>
    </>
  );
};

export default PostView;
