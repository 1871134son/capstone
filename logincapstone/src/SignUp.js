import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';

function SignUpPage(){
    const[currentStep,setCurrentStep] = useState(1);
  
    function handleContinue(){
        setCurrentStep(2); //다음 컴포넌트(상세정보 입력) 으로
    }
  
    return(
        <>
            {currentStep == 1 && <SignUpFirst onContinue={handleContinue} />}
            {currentStep == 2 && <SignUpSecond />}
        </>
    )
  }

  

  function SignUpFirst({onContinue}){
    return(
        <>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
  <Card style={{ minWidth: '400px', maxWidth: '500px' }}>
    <Card.Header style={{fontSize:"20px" ,fontWeight:"bold"}} >Sign up to EduNavi</Card.Header>
    <Card.Body>
      <Form>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label style={{fontWeight:"bold"}}>이메일</Form.Label>
          <Form.Control type="email" placeholder="hansung123@naver.com" />
        </Form.Group>
        
        <Button  onClick={onContinue} variant="primary" style={{ width:'400px',marginBottom:"10px", backgroundColor:"#FF3224", fontWeight:"bold"}}>
             계속하기
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
</>
    )
  }//SignUpFirst 컴포넌트

  function SignUpSecond(){
   return(
    <>
    <div className="d-flex justify-content-center align-items-center" style={{ height: '95vh' }}>
        <Card style={{ minWidth: '500px', maxWidth: '600px' }}>
            <Card.Header style={{fontSize:"20px" ,fontWeight:"bold"}} >EduNavi에 오신 것을 환영합니다!</Card.Header>
            <Card.Body>
            <Form>

                <Form.Group className="mb-3" controlId="formGroupEmail"style={{textAlign:"left"}}>
                <Form.Label style={{fontWeight:"bold"}}>이메일</Form.Label>
                <Form.Control type="email" placeholder="hansung123@naver.com" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupuserName" style={{textAlign:"left"}}>
                <Form.Label style={{fontWeight:"bold",textAlign:"left"}}>유저 이름</Form.Label>
                <Form.Control type="text" placeholder="유저이름" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupPassword" style={{textAlign:"left"}}>
                <Form.Label style={{fontWeight:"bold",textAlign:"left"}}>비밀번호</Form.Label>
                <Form.Control type="text" placeholder="password" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupPasswordConfirm" style={{textAlign:"left"}}>
                <Form.Label style={{fontWeight:"bold",textAlign:"left"}}>비밀번호 확인</Form.Label>
                <Form.Control type="text" placeholder="confirm password" />
                </Form.Group>
                
                <Form.Label style={{fontWeight:"bold",textAlign:"left"}}>관심 있는 자격증을 최대 3가지 골라주세요.</Form.Label> <br></br><br></br>


                <Form.Group className="mb-3" controlId="formGroupLicense1" style={{textAlign:"left"}}>
                <Form.Label style={{fontWeight:"bold"}}>관심 있는 자격증1</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option>없음</option>
                    <option value="1">정보처리기사</option>
                    <option value="2">빅데이터분석기사</option>
                    <option value="3">정보보안기사</option>
                    <option value="4">전기기사</option>
                    <option value="5">전기공사기사</option>
                    <option value="6">정보관리기술사</option>
                </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupLicense1" style={{textAlign:"left"}}>
                <Form.Label style={{fontWeight:"bold"}}>관심 있는 자격증2</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option>없음</option>
                    <option value="1">정보처리기사</option>
                    <option value="2">빅데이터분석기사</option>
                    <option value="3">정보보안기사</option>
                    <option value="4">전기기사</option>
                    <option value="5">전기공사기사</option>
                    <option value="6">정보관리기술사</option>
                </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupLicense1" style={{textAlign:"left"}}>
                <Form.Label style={{fontWeight:"bold"}}>관심 있는 자격증3</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option>없음</option>
                    <option value="1">정보처리기사</option>
                    <option value="2">빅데이터분석기사</option>
                    <option value="3">정보보안기사</option>
                    <option value="4">전기기사</option>
                    <option value="5">전기공사기사</option>
                    <option value="6">정보관리기술사</option>
                </Form.Select>
                </Form.Group>

                <Button  onClick={()=>{
                    console.log("가입 로직, 벡엔드 연결? 파이어베이스 활용")
                }} variant="primary" style={{ width:'400px',marginBottom:"10px",marginTop:"20px", backgroundColor:"#FF3224", fontWeight:"bold"}}>
                    가입하기
                </Button>

            </Form>
            </Card.Body>
        </Card>
</div>
</>
   )
  }


  export default SignUpPage;