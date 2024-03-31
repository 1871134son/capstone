import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignInPage from './routes/SignIn.js';
import SignUpPage from './routes/SignUp.js';
import HomePage from './routes/Home.js';
import Calendar from './routes/Calendar.js';
import LinkAPage from './routes/LinkA.js';
import LinkBPage from './routes/LinkB.js';
import LinkCPage from './routes/LinkC.js';
import LinkDPage from './routes/LinkD.js';
//import BoardList from './routes/BoardList';
import Write from './routes/Write';
import PostMain from './routes/post/PostMain';
import PostView from './routes/post/PostView';


function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePageWithLinks />} />
        <Route path="/postView/:no" element={<PostView/>} />
        <Route path="/postlist" element={<PostMain/>} />
        <Route path="/write" element={<Write />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/linkA" element={<LinkAPage />} />
        <Route path="/linkB" element={<LinkBPage />} />
        <Route path="/linkC" element={<LinkCPage />} />
        <Route path="/linkD" element={<LinkDPage />} />
      </Routes>
    </div>
  );
}

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">EduNavi</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/calendar">캘린더</Nav.Link>
          <Nav.Link href="/postlist">게시판</Nav.Link>
          
          <Nav.Link href="/mypage">내 정보</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Link href="/signup">회원가입</Nav.Link>
          <Nav.Link href="/signin">로그인</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

function HomePageWithLinks() {
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