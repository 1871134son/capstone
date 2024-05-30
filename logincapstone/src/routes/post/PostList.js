import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommonTable from '../../routes/component/table/CommonTable';
import CommonTableColumn from '../../routes/component/table/CommonTableColumn';
import CommonTableRow from '../../routes/component/table/CommonTableRow';
import { fetchPostsFromFirebase, getUserName } from '../../firebase/firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import dateFormat from 'dateformat';
import './PostList.css';

const PostMain = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userName = await getUserName();
          setCurrentUser(userName);
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
                  <CommonTableColumn className="num">{item.brdno}</CommonTableColumn>
                  <CommonTableColumn>
                    <Link to={`/postView/${item.id}`} className="titlehover">{item.title}</Link>
                  </CommonTableColumn>
                  <CommonTableColumn>{dateFormat(item.brddate, "yyyy-mm-dd")}</CommonTableColumn>
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
          {currentUser ? (
            <Link to="/write">
              <button className="custom-write-button">글쓰기</button>
            </Link>
          ) : (
            <Link to="/signin">
              <button className="custom-write-button">글쓰기</button>
            </Link>
          )}
          <div className="bt_wrap">
            <a href="#" className="on">목록</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostMain;