import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommonTable from '../../routes/component/table/CommonTable';
import CommonTableColumn from '../../routes/component/table/CommonTableColumn';
import CommonTableRow from '../../routes/component/table/CommonTableRow';
import { postList } from '../../routes/Data';
import { fetchPostsFromFirebase } from '../../firebase/firebase.js'; // 파이어베이스에서 데이터


const PostList = props => {
  const [ dataList, setDataList ] = useState([]);

  // useEffect(() => {
  //   setDataList(postList);
  // }, [ ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Firebase에서 데이터 가져오기
        const posts = await fetchPostsFromFirebase();
        setDataList(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* <CommonTable headersName={['글번호', '제목', '등록일', '작성자']}>
        {
          dataList ? dataList.map((item, index) => {
            return (
              <CommonTableRow key={index}>
                <CommonTableColumn>{ item.no }</CommonTableColumn>
                <CommonTableColumn>
                  <Link to={`/postView/${item.no}`}>{ item.title }</Link>
                </CommonTableColumn>
                <CommonTableColumn>{ item.createDate }</CommonTableColumn>
                <CommonTableColumn>{ item.readCount }</CommonTableColumn>
              </CommonTableRow>
            )
          }) : ''
        }
      </CommonTable> */}
      <CommonTable headersName={['글번호', '제목', '등록일', '작성자']}>
        {dataList.map((item, index) => (
          <CommonTableRow key={index}>
            <CommonTableColumn>{item.brdno}</CommonTableColumn>
            <CommonTableColumn>
              <Link to={`/postView/${item.brdno}`}>{item.title}</Link>
            </CommonTableColumn>
            <CommonTableColumn>{item.brddate}</CommonTableColumn>
            <CommonTableColumn>{item.brdwriter}</CommonTableColumn>
          </CommonTableRow>
        ))}
      </CommonTable>
    </>
  );
};

export default PostList;