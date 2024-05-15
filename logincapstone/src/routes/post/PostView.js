import React, { useEffect, useState } from 'react';
import { getPostByNo } from '../../routes/Data';
import './Post.css';
import { useParams, useNavigate } from 'react-router-dom'; // useParams와 useNavigate 가져오기
import Button from "react-bootstrap/Button";
import { getPostByNoFromFirebase, deletePostFromFirebase, updatePostInFirebase, addCommentToPost, getCommentsByPostNo } from '../../firebase/firebase.js';
import dateFormat from 'dateformat';
import { getUserName } from '../../firebase/firebase.js';

  const PostView = () => {
    const [data, setData] = useState({});
    const { brdno } = useParams(); // useParams를 사용하여 파라미터 추출
    const navigate = useNavigate(); // navigate 함수 사용
    const [currentUser, setCurrentUser] = useState(null); // 현재 사용자의 정보 상태 추가


    //수정
    const [editing, setEditing] = useState(false); // 수정 중 여부 상태 추가
    const [editedTitle, setEditedTitle] = useState(''); // 수정된 제목 상태 추가
    const [editedContent, setEditedContent] = useState(''); // 수정된 내용 상태 추가


    // 댓글 관련 상태 추가
    const [comments, setComments] = useState([]); // 댓글 상태 추가
    const [newComment, setNewComment] = useState(''); // 새 댓글 상태 추가


    console.log("가져온 brdno:", brdno);
    
  
    useEffect(() => {
      
      //console.log("데이터", data);
      const fetchData = async () => {
        
        try {
          const postData = await getPostByNoFromFirebase(brdno);
          console.log("가져온 데이터:", postData);
          setData(postData);

          //수정
          setEditedTitle(postData.title); // 수정된 제목 상태 초기화
          setEditedContent(postData.content); // 수정된 내용 상태 초기화
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };
  
      fetchData();
    }, [brdno]);



    useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          // 현재 사용자의 이름 가져오기
          const userName = await getUserName();
          setCurrentUser(userName);
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      };
  
      fetchCurrentUser();
    }, []);


//댓글
useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await getCommentsByPostNo(brdno); // 해당 게시글의 댓글 가져오기
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [brdno]);

  const handleAddComment = async () => {
    try {
      // 현재 사용자의 UID 가져오기
      const commenter = currentUser.uid;
      // 댓글 추가 함수 호출 시 작성자 정보도 함께 전달
      await addCommentToPost(brdno, newComment, commenter);
      setNewComment('');
      // 새로운 댓글을 화면에 표시하기 위해 댓글 목록 다시 가져오기
      const commentsData = await getCommentsByPostNo(brdno);
      setComments(commentsData);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };


    //삭제
    const handleDelete = async () => {
      try {
        await deletePostFromFirebase(brdno);
        console.log('게시물 삭제 성공');
        navigate('/postlist');
      } catch (error) {
        console.error('게시물 삭제 오류:', error);
      }
    };
    

    //수정
    const handleUpdate = async () => {
      try {
        await updatePostInFirebase(brdno, { title: editedTitle, content: editedContent });
        console.log('게시물 수정 성공');
        setEditing(false); // 수정 완료 후 editing 상태를 false로 변경
      } catch (error) {
        console.error('게시물 수정 오류:', error);
      }
    };




  return (
    <>
      <h2 align="center">게시글 상세정보</h2>

      <div className="post-view-wrapper">
        {
          data ? (
            <>
              <div className="post-view-row">
                <label>게시글 번호</label>
                <label>{ data.brdno }</label>
              </div>
              <div className="post-view-row">
                <label>작성자</label>
                <label>{ data.brdwriter }</label>
              </div>
              <div className="post-view-row">
                <label>작성일</label>
                <label>{dateFormat(data.brddate, "yyyy-mm-dd")}</label>
              </div>
              {/* 수정 버튼 클릭 시 제목과 내용을 input 요소로 변경 */}
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

            </>
          ) : '해당 게시글을 찾을 수 없습니다.'
        }
        <button className="post-view-go-list-btn" onClick={() => navigate(-1)}>목록으로 돌아가기</button>

          {/* 수정 버튼 클릭 시 수정/저장 버튼으로 변경 */}
          {currentUser === data.brdwriter && (
          editing ? (
            <Button variant="success" onClick={handleUpdate}>저장</Button>
          ) : (
            <Button variant="success" onClick={() => setEditing(true)}>수정</Button>
          )
        )}

        {/* 작성자와 현재 사용자의 이름이 같을 때만 삭제 버튼이 활성화되도록 함 */}
        {currentUser === data.brdwriter && (
          <Button variant="danger" onClick={handleDelete}>삭제</Button>
        )}
      </div>



{/* 댓글 렌더링 및 입력 요소 추가 */}
<div className="comments-section">
        {/* 댓글 목록 렌더링 */}
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p>{comment.content}</p> {/* 댓글 내용 */}
            <p>{dateFormat(comment.date, "yyyy-mm-dd")}</p> {/* 댓글 작성일 */}
            {/* 댓글 삭제 버튼 */}
            {currentUser === comment.writer && (
              <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
            )}
          </div>
        ))}

        {/* 새로운 댓글 입력 요소 */}
        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <button onClick={handleAddComment}>댓글 추가</button>
      </div>




    </>
  )
}

export default PostView;