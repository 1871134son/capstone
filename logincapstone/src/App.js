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

  const topSliderContents = [
    { id: 101, href: "https://example.com/link1", src: "IT_certifi.jpg", alt: "Top Link 1", text: "AWS 자격증" },
    { id: 102, href: "https://example.com/link2", src: "certifi.jpg", alt: "Top Link 2", text: "프랜차이즈 전문자 자격증" },
    { id: 103, href: "https://example.com/link3", src: "baristar.jpg", alt: "Top Link 3", text: "바리스타 자격증 수강신청" },
  ];

  const sliderContents = [
    { id: 4, href: "https://www.edu2080.co.kr/content.php?co_id=s51", src: "leader.jpg", alt: "Extra Link 4", text: "청소년지도사란? 청소년기본법 제21조 제1항에 의거하여 청소년지도사 자격시험에 합격하고 청소년지도사 연수기관에서 실시하는 연수과정을 마친 후 국가(여성가족부장관)로부터 자격을 부여 받는 국가전문자격증입니다." },
    { id: 5, href: "https://product.kyobobook.co.kr/detail/S000061351864", src: "3dprint.jpg", alt: "Extra Link 5", text: "현재 글로벌 3D 프린팅 산업은 해마다 지속적인 성장률을 보이고 있으며 최근 S/W 대기업 및 제조업체의 3D 프린터 시장 진출로 항공우주, 자동차, 덴탈, 군사 등 다양한 분야에서 시장의 변화가 다원화되는 분야인 만큼 해당 기술이 가진 진출성이 앞으로도 커질 것입니다. 이 도서는 핵심이론 및 핵심예제, 실전 모의고사뿐만 아니라 과년도+최근 기출복원문제를 한 권으로 구성해 단기간에 학습할 수 있도록 하였습니다. 산업기사 시험은 만점을 목표로 하는 시험이 아니라 평균 60점 이상을 받아 합격하는 것에 의의가 있기 때문에, 핵심만 간추려 시험에 꼭 나오는 부분을 중점적으로 공부할 수 있도록 제시하는 것이 합리적이고 계획적인 수험서가 갖추어야 할 조건입니다. Win-Q 3D프린터개발산업기사는 그 조건에 부합합니다." },
    { id: 6, href: "https://www.nbedu.or.kr/bbs/content.php?co_id=major5_6", src: "car_fix.jpg", alt: "Extra Link 6", text: "자동차정비 현장실무 교육을 받으며 자동차정비산업기사 자격증까지 취득할 수 있는 과정" },
    { id: 7, href: "http://www.ysnaracook.co.kr/bbs/board.php?bo_table=gallery&wr_id=175&page=9", src: "fish.jpg", alt: "Extra Link 7", text: "양산 음식나라조리학원 복어조리기능사 수업 입니다. ​저희 양산음식나라조리학원은 최고의 합격률,최고의 시설, 최고의 강사진으로써 여러분들을 기다리고있습니다." },
    { id: 8, href: "https://wsart.co.kr/certificate/interior1/", src: "archi.jpg", alt: "Extra Link 8", text: "실내공간은 기능적 조건뿐만 아니라, 인간의 예술적, 정서적 욕구의 만족까지 추구해야 하는 것으로, 실내 공간을  계획하는 실내건축 분야는 환경에 대한..." },
    { id: 9, href: "https://janet.co.kr/bbs/board.php?bo_table=bNews&wr_id=760", src: "clothes.jpg", alt: "Extra Link 9", text: "변경 목적 : 출제기준 변경에 따른 필기과목 및 실기시험 평가방법 개편   적용시기 : 2023년 기사 제2회부터" }
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
                <Link to="/signin">로그인/회원가입</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {!isAuthPage.includes(location.pathname) && !location.pathname.includes('/licenseInfoPage/') && (
        <>
          <div className="main-content">
            <HomePageWithLinksSlider slideIndex={slideIndex} />
            <div className="additional-links">
              {topSliderContents.map(link => (
                <div key={link.id} className="link-container">
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <img src={`${process.env.PUBLIC_URL}/${link.src}`} alt={link.alt} className="link-image" />
                    <div className="link-text">{link.text}</div>
                  </a>
                </div>
              ))}
            </div>
            <AdditionalLinksSlider links={sliderContents} />
          </div>
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
              <a htef="https://www.q-net.or.kr/man001.do?gSite=Q" target="_blank">
              </a>
              <a htef="https://www.comcbt.com/" target="_blank">
              </a>
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
