import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SignInPage, SignUpPage, SignUpSecond } from './routes/login/SignUp.js';
import HomePage from './routes/Home.js';
import MyPage from './routes/MyPage.js';
import Calendar from './routes/Calendar.js';
import Write from './routes/Write';
import PostList from './routes/post/PostList';
import PostView from './routes/post/PostView';
import HomePageWithLinksSlider from './routes/HomePageWithLinksSlider.js';
import AdditionalLinksSlider from './routes/AdditionalLinksSlider.js';
import LicenseInfoPage from './routes/LicenseInfoPage.js';
import CertificationInfoPage from './routes/CertificationInfoPage.js';
import { DisplayImage } from './firebase/firebase.js';
import { SearchLicenseComponent } from './testStuff/stuff.js';
import { FaUser, FaBars } from 'react-icons/fa';

function App() {
  const location = useLocation();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const sliderContents = [
    { id: 4, href: "https://www.edu2080.co.kr/content.php?co_id=s51", src: "leader.jpg", alt: "Extra Link 4", text: "" },
    { id: 5, href: "https://product.kyobobook.co.kr/detail/S000061351864", src: "3dprint.jpg", alt: "Extra Link 5", text: "" },
    { id: 6, href: "https://www.nbedu.or.kr/bbs/content.php?co_id=major5_6", src: "car_fix.jpg", alt: "Extra Link 6", text: "" },
    { id: 7, href: "http://www.ysnaracook.co.kr/bbs/board.php?bo_table=gallery&wr_id=175&page=9", src: "fish.jpg", alt: "Extra Link 7", text: "" },
    { id: 8, href: "https://wsart.co.kr/certificate/interior1/", src: "archi.jpg", alt: "Extra Link 8", text: "" },
    { id: 9, href: "https://janet.co.kr/bbs/board.php?bo_table=bNews&wr_id=760", src: "clothes.jpg", alt: "Extra Link 9", text: "" }
  ];

  const isAuthPage = [
    '/signin',
    '/signup',
    '/signup/second',
    '/calendar',
    '/postlist',
    '/myPage',
    `/postView/${location.pathname.split('/')[2]}`,
    '/write',
    '/certificationInfo'
  ];

  return (
    <div className={`wrap ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header">
        <div className="inner">
          <div className="logo">
            <h1>
              <Link to="/">
                <DisplayImage
                  folderName="logo"
                  fileName="logo.jpg"
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '100px',
                    width: '100px',
                    height: '120px',
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
                <Link to="/certificationInfo">자격증 정보</Link>
              </li>
              <li>
                <Link to="/postlist">게시판</Link>
              </li>
              <li>
                <Link to="/calendar">캘린더</Link>
              </li>
              <li>
                <Link to="/signin">로그인/회원가입</Link>
              </li>
              <li>
                <Link to="/myPage">
                  <FaUser className="user-icon" />
                </Link>
              </li>
              <li>
                <FaBars className="menu-icon" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="hr"></hr>

      <div className="nav-below-image">
        {(!isAuthPage.includes(location.pathname) && !location.pathname.includes('/licenseInfoPage/')) && (
          <div className="image-with-text">

            <img src="edunavi.jpg" alt="Random" className="nav-below-image-element" />
            <div className="spacing"></div> {/* Added spacing div */}

          </div>
        )}
      </div>
      <div className="nav-below-image">
        {(!isAuthPage.includes(location.pathname) && !location.pathname.includes('/licenseInfoPage/')) && (
          <div className="image-with-text">
            <img src="main.jpg" alt="Random" className="nav-below-image-element" />
            <div className="spacing"></div> {/* Added spacing div */}

          </div>
        )}
      </div>


      {!isAuthPage.includes(location.pathname) && !location.pathname.includes('/licenseInfoPage/') && (
        <>
          <div className="main-content">
            <div className="info-boxes-container">
              <div className="info-box">
                <img src="/public/commu.jpg" alt="Info Box Image" /> {/* Replace with your image path */}
                <div className="main-text">교육 전액 무료 및 훈련 장려금 지급</div>
                <div className="sub-text">월 출석률 80%이상 달성 시 최대 60만원 지원</div>
              </div>
              <div className="info-box">
                <img src="/public/commu.jpg" alt="Info Box Image" /> {/* Replace with your image path */}
                <div className="main-text">게시판 기능 추가</div>
                <div className="sub-text">월 출석률 80%이상 달성 시 최대 60만원 지원</div>
              </div>
              <div className="info-box">
                <img src="/public/commu.jpg" alt="Info Box Image" /> {/* Replace with your image path */}
                <div className="main-text">캘린더</div>
                <div className="sub-text">월 출석률 80%이상 달성 시 최대 60만원 지원</div>
              </div>
              <div className="info-box">
                <img src="/public/commu.jpg" alt="Info Box Image" /> {/* Replace with your image path */}
                <div className="main-text">교육 전액 무료 및 훈련 장려금 지급</div>
                <div className="sub-text">월 출석률 80%이상 달성 시 최대 60만원 지원</div>
              </div>
              <div className="info-box">
                <img src="/public/commu.jpg" alt="Info Box Image" /> {/* Replace with your image path */}
                <div className="main-text">교육 전액 무료 및 훈련 장려금 지급</div>
                <div className="sub-text">월 출석률 80%이상 달성 시 최대 60만원 지원</div>
              </div>
            </div>
            <div className="spacing"></div> {/* Added spacing div */}
            <div className="hometext">동아리 공모전 참여 포스터</div>
            <HomePageWithLinksSlider slideIndex={slideIndex} />
            <div className="spacing"></div> {/* Added spacing div */}
            <div className="hometext">자격증 정보 상세 페이지</div>
            <AdditionalLinksSlider links={sliderContents} />
          </div>
          <div className="spacing"></div> {/* Added spacing div */}
        </>
      )}

      <Routes>
        <Route path="/licenseInfoPage/:id" element={<LicenseInfoPage />} />
        <Route path="/postView/:postId" element={<PostView />} />
        <Route path="/postlist" element={<PostList />} />
        <Route path="/write" element={<Write />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup/second" element={<SignUpSecond />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/certificationInfo" element={<CertificationInfoPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>

      {!isAuthPage.includes(location.pathname) && (
        <div className="footer">
          <div className="inner">
            <div className="bt_logo">
              <a href="https://github.com/1871134son/capstone" target="_blank" rel="noopener noreferrer">
                <img src="/icon.png" alt="깃허브 아이콘" className="github-icon" />
              </a>
            </div>
            <div className="site">
              <a href="https://www.q-net.or.kr/main.jsp" target="_blank" rel="noopener noreferrer">큐넷 바로가기</a>
              <a href="https://www.comcbt.com/" target="_blank" rel="noopener noreferrer">cbt 문제 풀어보기</a>
            </div>
            <div className="bt_menu">
              <ul>
                <li><Link to="/postlist">게시판</Link></li>
                <li><Link to="/myPage">내 정보</Link></li>
                <li><Link to="/calendar">캘린더</Link></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
