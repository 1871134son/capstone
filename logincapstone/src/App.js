// App.js

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignInPage from './routes/SignIn.js';
import SignUpPage from './routes/SignUp.js';
import HomePage from './routes/Home.js';
import MyPage from './routes/MyPage.js';
import Calendar from './routes/Calendar.js';
import Write from './routes/Write';
import PostList from './routes/post/PostList';
import PostView from './routes/post/PostView';
import HomePageWithLinksSlider from './routes/HomePageWithLinksSlider.js';
import AdditionalLinksSlider from './routes/AdditionalLinksSlider.js';
import './App.css';
import LicenseInfoPage from './routes/LicenseInfoPage.js';
import CertificationInfoPage from './routes/CertificationInfoPage.js';

function App() {
  const location = useLocation();
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const sliderContents = [
    [
      { id: 1, href: "/https://boottent.com/community/article/20230725123326", src: "IT_certifi.jpg", alt: "Extra Link 1" },
      { id: 2, href: "/extraLink2", src: "certifi.jpg", alt: "Extra Link 2" },
      { id: 3, href: "/extraLink3", src: "baristar.jpg", alt: "Extra Link 3" }
    ],
    [
      { id: 4, href: "/extraLink4", src: "extra_image4.jpg", alt: "Extra Link 4" },
      { id: 5, href: "/extraLink5", src: "extra_image5.jpg", alt: "Extra Link 5" },
      { id: 6, href: "/extraLink6", src: "extra_image6.jpg", alt: "Extra Link 6" }
    ],
    [
      { id: 7, href: "/extraLink7", src: "extra_image7.jpg", alt: "Extra Link 7" },
      { id: 8, href: "/extraLink8", src: "extra_image8.jpg", alt: "Extra Link 8" },
      { id: 9, href: "/extraLink9", src: "extra_image9.jpg", alt: "Extra Link 9" }
    ]
  ];

  const isAuthPage = [
    '/signin',
    '/signup',
    '/calendar',
    '/postlist',
    '/myPage',
    `/postView/${location.pathname.split('/')[2]}`, // PostView 페이지에서 Extra 링크가 나오지 않도록 설정
    '/write' // Write 페이지에서도 Extra 링크가 나오지 않도록 설정
  ];

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
                <Link to="/certificationInfo">자격증 정보</Link>
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

      <Routes>
        <Route path="/licenseInfoPage/:id" element={<LicenseInfoPage />} />
        <Route path="/postView/:brdno" element={<PostView />} />
        <Route path="/postlist" element={<PostList />} />
        <Route path="/write" element={<Write />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/certificationInfo" element={<CertificationInfoPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>

      {!isAuthPage.includes(location.pathname) && (
        <>
          <HomePageWithLinksSlider slideIndex={slideIndex} />
          {sliderContents.map((links, index) => (
            <AdditionalLinksSlider key={index} links={links} />
          ))}
        </>
      )}

      {!isAuthPage.includes(location.pathname) && (
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
      )}
    </div>
  );
}

export default App;
