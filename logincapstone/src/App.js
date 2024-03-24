import './App.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button'; //Button import
import SignInPage from './routes/SignIn.js';
import SignUpPage from './routes/SignUp.js';
import HomePage from './routes/Home.js';
<<<<<<< HEAD
import Calendar from './routes/Calendar.js';
import LinkAPage from './routes/LinkA.js';
import LinkBPage from './routes/LinkB.js';
import LinkCPage from './routes/LinkC.js';
import LinkDPage from './routes/LinkD.js';

=======
import Calendar from './routes/Calendar.js'; // 캘린더 페이지 추가
>>>>>>> 44f41e648a8e226f9027cd57171e28944d35b256

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<HomePageWithLinks />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/linkA" element={<LinkAPage />} />
        <Route path="/linkB" element={<LinkBPage />} />
        <Route path="/linkC" element={<LinkCPage />} />
        <Route path="/linkD" element={<LinkDPage />} />
=======
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/Calendar" element={<Calendar />} /> {/* 캘린더 페이지 라우트 추가 */}
>>>>>>> 44f41e648a8e226f9027cd57171e28944d35b256
      </Routes>
    </div>
  );
}

function NavigationBar() {
  return (
<<<<<<< HEAD
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">EduNavi</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/calendar">캘린더</Nav.Link>
=======
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">EduNavi</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/Calendar">캘린더</Nav.Link> {/* 캘린더 링크 추가 */}
>>>>>>> 44f41e648a8e226f9027cd57171e28944d35b256
          <Nav.Link href="/features">게시판</Nav.Link>
          <Nav.Link href="/mypage">내 정보</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
<<<<<<< HEAD
=======
          {/* ms-auto , 우측정렬 */}
>>>>>>> 44f41e648a8e226f9027cd57171e28944d35b256
          <Nav.Link href="/signup">회원가입</Nav.Link>
          <Nav.Link href="/signin">로그인</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

<<<<<<< HEAD
function HomePageWithLinks() {
  // 네비게이션 바 아래에 4개 메뉴 추가
  return (
    <div>
      <HomePage />
      <div className="links-wrapper">
        <LinkContainer to="/linkA">
          <img src="linkA_image.jpg" alt="Link A" className="link-image" />
        </LinkContainer>
        <LinkContainer to="/linkB">
          <img src="linkB_image.jpg" alt="Link B" className="link-image" />
        </LinkContainer>
        <LinkContainer to="/linkC">
          <img src="linkC_image.jpg" alt="Link C" className="link-image" />
        </LinkContainer>
        <LinkContainer to="/linkD">
          <img src="linkD_image.jpg" alt="Link D" className="link-image" />
        </LinkContainer>
      </div>
    </div>
  );
}


function LinkContainer({ to, children }) {
  return <Link to={to} className="link-container">{children}</Link>;
}



export default App;
=======
export default App;
>>>>>>> 44f41e648a8e226f9027cd57171e28944d35b256
