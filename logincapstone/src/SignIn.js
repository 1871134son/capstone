import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';

function SignInPage() {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Card style={{ minWidth: '400px', maxWidth: '500px' }}>
          <Card.Header style={{fontSize:"20px" ,fontWeight:"bold"}} >Sign in to EduNavi</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label style={{fontWeight:"bold"}}>이메일</Form.Label>
                <Form.Control type="email" placeholder="example123@naver.com" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Label style={{fontWeight:"bold"}}>비밀번호</Form.Label>
                <Form.Control type="password" placeholder="Password" />
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