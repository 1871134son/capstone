import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommonTable from '../../routes/component/table/CommonTable';
import CommonTableColumn from '../../routes/component/table/CommonTableColumn';
import CommonTableRow from '../../routes/component/table/CommonTableRow';
import Button from "react-bootstrap/Button";
import dateFormat from 'dateformat';
import { fetchPostsFromFirebase } from '../../firebase/firebase.js';
import './PostList.css';

const PostMain = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await fetchPostsFromFirebase();
        setDataList(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, []);

  const formatDate = date => {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const filteredPosts = dataList.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > Math.ceil(filteredPosts.length / postsPerPage)) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(filteredPosts.length / postsPerPage)));
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(Math.ceil(filteredPosts.length / postsPerPage));
  };

  const handleItemsPerPageChange = e => {
    setPostsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <>
      <div className="board_wrap">
        <div className="board_title">
          <strong>게시판</strong>
        </div>
        <div className="items-per-page">
          <span>Show: </span>
          <select value={postsPerPage} onChange={handleItemsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          <span> items per page</span>
        </div>
        <div className="board_list_wrap">
          <div className="board_list">
            <CommonTable className="top" headersName={['글번호', '제목', '등록일', '작성자']}>
              {currentPosts.map((item, index) => (
                <CommonTableRow key={index}>
                  <CommonTableColumn className="num"><div className="post-number">{item.brdno}</div></CommonTableColumn>
                  <CommonTableColumn>
                    <Link to={`/postView/${item.brdno}`}>{item.title}</Link>
                  </CommonTableColumn>
                  <CommonTableColumn>{formatDate(item.brddate)}</CommonTableColumn>
                  <CommonTableColumn>{item.brdwriter}</CommonTableColumn>
                </CommonTableRow>
              ))}
            </CommonTable>
          </div>
          <div className="board_page">
            <a href="#" className="bt first" onClick={goToFirstPage}>{"<<"}</a>
            <a href="#" className="bt prev" onClick={goToPrevPage}>{"<"}</a>
            {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, i) => i + 1).map(number => (
              <Link key={number} to="#" className={`num ${currentPage === number ? 'on' : ''}`} onClick={() => paginate(number)}>
                {number}
              </Link>
            ))}
            <a href="#" className="bt next" onClick={goToNextPage}>{">"}</a>
            <a href="#" className="bt last" onClick={goToLastPage}>{">>"}</a>
          </div>
          {/* "글쓰기" 버튼을 감싸는 Link 컴포넌트, custom-write-button 클래스를 사용하여 스타일 적용 */}
          <Link to="/write" className="button">
            <Button variant="info" className="custom-write-button">글쓰기</Button>
          </Link>
          <div className="bt_wrap">
            <a href="#" className="on">목록</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostMain;