import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import {signIn} from "../firebase/firebase.js"
function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await signIn(email, password);
    navigate('/'); // 로그인 성공 시 홈 페이지로 이동
  };

  return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Card style={{ minWidth: '400px', maxWidth: '500px' }}>
          <Card.Header style={{fontSize:"20px" ,fontWeight:"bold"}} >Sign in to EduNavi</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label style={{fontWeight:"bold"}}>이메일</Form.Label>
                <Form.Control type="email" placeholder="example123@naver.com"
                value={email} onChange={(e)=>{setEmail(e.target.value)}} required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Label style={{fontWeight:"bold"}}>비밀번호</Form.Label>
                <Form.Control type="password" placeholder="Password" 
                value={password} onChange={(e)=>{setPassword(e.target.value)}} required
                />
              </Form.Group>
              
              <Button variant="primary" type="submit"style={{ width:'400px',marginBottom:"10px", backgroundColor:"#FF3224", fontWeight:"bold"}}>
                   로그인
              </Button>

              <Button variant="primary" type="submit"style={{ width:'400px',marginBottom:"10px", backgroundColor:"gray",fontWeight:"bold" }}>
              <FontAwesomeIcon icon={faGoogle} /> Google 계정으로 계속하기
              </Button>

              <Button variant="primary" type="submit"style={{ width:'400px',marginBottom:"10px",fontWeight:"bold" }}>
              <FontAwesomeIcon icon={faFacebook} /> Facebook 계정으로 계속하기
              </Button>
               

            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
  
  export default SignInPage;