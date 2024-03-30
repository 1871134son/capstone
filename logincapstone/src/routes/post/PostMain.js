import React from 'react';
import PostList from './PostList';
import { withRouter } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const PostMain = props => {
  return (
    <>
      <h2 align="center">정보 게시판</h2>
      <Link to="/write">
      <Button variant="info">글쓰기</Button>
      </Link>
      <PostList />
    </>
  )
}

export default PostMain;