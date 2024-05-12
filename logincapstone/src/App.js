import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignInPage from './routes/SignIn.js';
import SignUpPage from './routes/SignUp.js';
import HomePage from './routes/Home.js';
import MyPage from './routes/MyPage.js';
import Calendar from './routes/Calendar.js';
import LinkAPage from './routes/LinkA.js';
import LinkBPage from './routes/LinkB.js';
import LinkCPage from './routes/LinkC.js';
import LinkDPage from './routes/LinkD.js';
import Write from './routes/Write';
import PostMain from './routes/post/PostMain';
import PostView from './routes/post/PostView';
import HomePageWithLinksSlider from './routes/HomePageWithLinksSlider.js';
import AdditionalLinksSlider from './routes/AdditionalLinksSlider.js';
import './App.css';

function App() {
  // 네비게이션 상태 관리
  const [subMenuVisible, setSubMenuVisible] = useState({
    calendar: false,
    post: false,
    myPage: false,
  });

  // 슬라이드 상태 관리
  const [slideIndex, setSlideIndex] = useState(0);

  // 슬라이드 변경 이벤트 핸들러
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1));
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="wrap">
      <div className="header">
        <div className="inner">
          <div className="logo">
            <h1>
              <Link to="/">
                <img src="images/logo.png" alt="홈 로고" />
              </Link>
            </h1>
          </div>
          <div className="nav">
            <ul className="main_menu">
              <li>
                <Link to="/calendar">캘린더</Link>
              </li>
              <li>
                <Link to="/postlist">게시판</Link>
              </li>
              <li>
                <Link to="/myPage">내 정보</Link>
              </li>
              <li>
                <Link to="/signin">로그인</Link>
              </li>
              <li>
                <Link to="/signup">회원가입</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 라우트 설정 */}
      <Routes>
        <Route path="/postView/:brdno" element={<PostView />} />
        <Route path="/postlist" element={<PostMain />} />
        <Route path="/write" element={<Write />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/linkA" element={<LinkAPage />} />
        <Route path="/linkB" element={<LinkBPage />} />
        <Route path="/linkC" element={<LinkCPage />} />
        <Route path="/linkD" element={<LinkDPage />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>

      {/* 추가된 컴포넌트 */}
      <HomePageWithLinksSlider slideIndex={slideIndex} />
      <AdditionalLinksSlider />

      <div className="footer">
        <div className="inner">
          <div className="bt_logo">
            <Link to="/">
              <img src="images/bt_logo.png" alt="홈 하단로고" />
            </Link>
          </div>
          <div className="bt_menu">
            <ul>
              <li><a href="/">하단 메뉴 1</a></li>
              <li><a href="/">하단 메뉴 2</a></li>
              <li><a href="/">하단 메뉴 3</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
