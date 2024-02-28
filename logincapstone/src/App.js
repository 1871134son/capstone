import './App.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import {Routes,Route,Link} from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button'; //Button import
import SignInPage from './SignIn.js'
import SignUpPage from './SignUp.js';
function App() {
  return (
    <div className="App">

       <NavigationBar></NavigationBar>
        <Routes>
          <Route path="/signin" element={<SignInPage></SignInPage>}></Route>
          <Route path="/signup" element={<SignUpPage></SignUpPage>}></Route>
        </Routes>


    </div>
  );
}

function NavigationBar(){
  return(
     <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">EduNavi</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/calander">캘린더</Nav.Link>
            <Nav.Link href="/features">게시판</Nav.Link>
            <Nav.Link href="/mypage">내 정보</Nav.Link>
          </Nav>
          <Nav className = "ms-auto"> {/*ms-auto , 우측정렬*/}
            <Nav.Link href="/signup">회원가입</Nav.Link>
            <Nav.Link href="/signin">로그인</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  )
}


export default App;
