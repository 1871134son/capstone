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
import CertificationInfoPage from './routes/CertificationInfoPage.js'; // 새로운 컴포넌트 추가
import { DisplayImage } from './firebase/firebase.js';
import { SearchLicenseComponent } from './testStuff/stuff.js';

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
      { id: 1, href: "https://boottent.com/community/article/20230725123326", src: "IT_certifi.jpg", alt: "Extra Link 1" },
      { id: 2, href: "https://www.tippingkorea.co.kr/kr/education/view.php?edu_idx=4218", src: "certifi.jpg", alt: "Extra Link 2" },
      { id: 3, href: "https://www.kpei.co.kr/license/license_86.asp", src: "baristar.jpg", alt: "Extra Link 3" }
    ],
    [
      { id: 4, href: "https://www.edu2080.co.kr/content.php?co_id=s51", src: "leader.jpg", alt: "Extra Link 4" },
      { id: 5, href: "https://product.kyobobook.co.kr/detail/S000061351864", src: "3dprint.jpg", alt: "Extra Link 5" },
      { id: 6, href: "https://www.nbedu.or.kr/bbs/content.php?co_id=major5_6", src: "car_fix.jpg", alt: "Extra Link 6" }
    ],
    [
      { id: 7, href: "http://www.ysnaracook.co.kr/bbs/board.php?bo_table=gallery&wr_id=175&page=9", src: "fish.jpg", alt: "Extra Link 7" },
      { id: 8, href: "https://wsart.co.kr/certificate/interior1/", src: "archi.jpg", alt: "Extra Link 8" },
      { id: 9, href: "https://janet.co.kr/bbs/board.php?bo_table=bNews&wr_id=760", src: "clothes.jpg", alt: "Extra Link 9" }
    ]
  ];

  const isAuthPage = [
    '/signin',
    '/signup',
    '/calendar',
    '/postlist',
    '/myPage',
    `/postView/${location.pathname.split('/')[2]}`,
    '/write',
    '/certificationInfo'
  ];

  return (
    <div className="wrap">
      <div className="header">
        <div className="inner">
          <div className="logo">
            <h1>
              <Link to="/">
                <DisplayImage
                  folderName="logo"
                  fileName="logo.jpg"
                  style={{
                    position: 'absolute',  // 추가된 속성
                    top: '-30px',
                    left: '180px',
                    width: '100px',
                    height: '100px',
                    objectFit: 'contain',
                    zIndex: 1000
                  }}
                ></DisplayImage>
              </Link>
            </h1>
            <SearchLicenseComponent></SearchLicenseComponent>
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
