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
import Calendar from './routes/Calendar.js'; // 캘린더 페이지 추가

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/Calendar" element={<Calendar />} /> {/* 캘린더 페이지 라우트 추가 */}
      </Routes>
    </div>
  );
}

function NavigationBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">EduNavi</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/Calendar">캘린더</Nav.Link> {/* 캘린더 링크 추가 */}
          <Nav.Link href="/features">게시판</Nav.Link>
          <Nav.Link href="/mypage">내 정보</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          {/* ms-auto , 우측정렬 */}
          <Nav.Link href="/signup">회원가입</Nav.Link>
          <Nav.Link href="/signin">로그인</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default App;