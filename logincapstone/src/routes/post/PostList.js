import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommonTable from '../../routes/component/table/CommonTable';
import CommonTableColumn from '../../routes/component/table/CommonTableColumn';
import CommonTableRow from '../../routes/component/table/CommonTableRow';
import { postList } from '../../routes/Data';
import { fetchPostsFromFirebase } from '../../firebase/firebase.js'; // 파이어베이스에서 데이터
import dateFormat from 'dateformat';


const PostList = props => {
  const [ dataList, setDataList ] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Firebase에서 데이터 가져오기
        const posts = await fetchPostsFromFirebase();
        // 날짜순으로 정렬
        posts.sort((a, b) => new Date(b.brddate) - new Date(a.brddate));
        setDataList(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, []);



  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Firebase에서 데이터 가져오기
  //       const posts = await fetchPostsFromFirebase();
  //       // 날짜 형식 변환 및 데이터 저장
  //       const formattedPosts = posts.map(post => ({
  //         ...post,
  //         brddate: formatDate(post.brddate),
  //       }));
  //       // 날짜순으로 정렬
  //       formattedPosts.sort((a, b) => new Date(b.brddate) - new Date(a.brddate));
  //       setDataList(formattedPosts);
  //     } catch (error) {
  //       console.error('Error fetching posts:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);


    //날짜 형식 변환 함수
    const formatDate = date => {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      return formattedDate;
    };


// 날짜 형식 변환 함수
// const formatDate = date => {
//   // 유효한 날짜인지 검사
//   if (isNaN(new Date(date).getTime())) {
//     // 올바르지 않은 형식이면 공백 반환
//     return '';
//   }
//   // 올바른 형식이면 ISO 형식으로 변환
//   return new Date(date).toISOString().split('T')[0];
// };


  return (
    <>
      <CommonTable headersName={['글번호', '제목', '등록일', '작성자']}>
        {dataList.map((item, index) => (
          <CommonTableRow key={index}>
            <CommonTableColumn>{item.brdno}</CommonTableColumn>
            <CommonTableColumn>
              <Link to={`/postView/${item.brdno}`}>{item.title}</Link>
            </CommonTableColumn>
            <CommonTableColumn>{formatDate(item.brddate)}</CommonTableColumn>
            {/* <CommonTableColumn>{dateFormat(item.brddate, "yyyy-mm-dd")}</CommonTableColumn> */}
            <CommonTableColumn>{item.brdwriter}</CommonTableColumn>
          </CommonTableRow>
        ))}
      </CommonTable>
    </>
  );
};

export default PostList;