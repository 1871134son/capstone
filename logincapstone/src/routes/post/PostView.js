import React, { useEffect, useState } from 'react';
import { getPostByNo } from '../../routes/Data';
import './Post.css';
import { useParams, useNavigate } from 'react-router-dom'; // useParams와 useNavigate 가져오기
import Button from "react-bootstrap/Button";
import { getPostByNoFromFirebase } from '../../firebase/firebase.js';



  const PostView = () => {
    const [data, setData] = useState({});
    const { brdno } = useParams(); // useParams를 사용하여 파라미터 추출
    const navigate = useNavigate(); // navigate 함수 사용
  

    console.log("가져온 brdno:", brdno);
    
  
    useEffect(() => {
      
      //console.log("데이터", data);
      const fetchData = async () => {
        
        try {
          const postData = await getPostByNoFromFirebase(brdno);
          console.log("가져온 데이터:", postData);
          setData(postData);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };
  
      fetchData();
    }, [brdno]);

    //날짜 형식 변환 함수
    const formatDate = date => {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      return formattedDate;
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
                <label>{  data.brddate  }</label>
              </div>
              <div className="post-view-row">
                <label>제목</label>
                <label>{ data.title }</label>
              </div>
              <div className="post-view-row">
                <label>내용</label>
                <div>
                  {
                    data.content
                  }
                </div>
              </div>
            </>
          ) : '해당 게시글을 찾을 수 없습니다.'
        }
        <button className="post-view-go-list-btn" onClick={() => navigate(-1)}>목록으로 돌아가기</button>
        <Button variant="danger">삭제</Button>
      </div>
    </>
  )
}

export default PostView;