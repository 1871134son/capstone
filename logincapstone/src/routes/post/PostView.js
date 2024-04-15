import React, { useEffect, useState } from 'react';
import { getPostByNo } from '../../routes/Data';
import './Post.css';
import { useParams, useNavigate } from 'react-router-dom'; // useParams와 useNavigate 가져오기




  const PostView = () => {
    const [data, setData] = useState({});
    const { no } = useParams(); // useParams를 사용하여 파라미터 추출
    const navigate = useNavigate(); // navigate 함수 사용
  
    useEffect(() => {
      setData(getPostByNo(no));
    }, [no]); // useEffect에서 의존성에 'no' 추가
  


  
  return (
    <>
      <h2 align="center">게시글 상세정보</h2>

      <div className="post-view-wrapper">
        {
          data ? (
            <>
              <div className="post-view-row">
                <label>게시글 번호</label>
                <label>{ data.no }</label>
              </div>
              <div className="post-view-row">
                <label>제목</label>
                <label>{ data.title }</label>
              </div>
              <div className="post-view-row">
                <label>작성일</label>
                <label>{ data.createDate }</label>
              </div>
              <div className="post-view-row">
                <label>조회수</label>
                <label>{ data.readCount }</label>
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
      </div>
    </>
  )
}

export default PostView;