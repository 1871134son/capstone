import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {signUp} from "../firebase/firebase.js"
import { useNavigate } from 'react-router-dom';

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
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [userName,setUserName] = useState('');
      const [confirm,setConfirm] = useState('');
      const [licenses,setLicenses] = useState(['없음','없음','없음']);
      const navigate = useNavigate();

      const handleSubmit = (event) => {
        event.preventDefault();
        if(confirmCheck(password,confirm)){
           signUp(email, password,userName,licenses);
          navigate('/'); // 로그인 성공 시 홈 페이지로 이동
        }
        else{
          alert("비밀번호 확인을 다시 입력하세요!");
        }
      };
     /*비밀번호, 비밀번호 확인의 일치 확인 */ 
     function confirmCheck(password,confirm){
      return password==confirm; 
     }
     const handleSelectChange = (index, value) => {
      // 상태 배열의 복사본을 만들고
      const updatedLicenses = [...licenses];
      // 선택된 인덱스의 값을 업데이트한 후
      updatedLicenses[index] = value;
      // 상태를 새로운 배열로 설정
      setLicenses(updatedLicenses);
    };

    return(
    <>
    <div className="d-flex justify-content-center align-items-center" style={{ height: '95vh' }}>
        <Card style={{ minWidth: '500px', maxWidth: '600px' }}>
            <Card.Header style={{fontSize:"20px" ,fontWeight:"bold"}} >EduNavi에 오신 것을 환영합니다!</Card.Header>
            <Card.Body>
            <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3" controlId="formGroupEmail"style={{textAlign:"left"}}>
                <Form.Label style={{fontWeight:"bold"}}>이메일</Form.Label>
                <Form.Control type="email" value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hansung123@naver.com" 
                required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupuserName" style={{textAlign:"left"}}>
                <Form.Label style={{fontWeight:"bold",textAlign:"left"}}>유저 이름</Form.Label>
                <Form.Control type="text" value={userName} placeholder="유저이름" 
                onChange={(e)=>{setUserName(e.target.value)}}
                required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupPassword" style={{textAlign:"left"}}>
                <Form.Label style={{fontWeight:"bold",textAlign:"left"}}>비밀번호</Form.Label>
                <Form.Control type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupPasswordConfirm" style={{textAlign:"left"}}>
                <Form.Label style={{fontWeight:"bold",textAlign:"left"}}>비밀번호 확인</Form.Label>
                <Form.Control type="password" value={confirm} placeholder="confirm password"
                onChange={(e)=>{setConfirm(e.target.value)}}
                required
                />
                </Form.Group>
                
                <Form.Label style={{fontWeight:"bold",textAlign:"left"}}>관심 있는 자격증을 최대 3가지 골라주세요.</Form.Label> <br></br><br></br>


                {Array.from({ length: 3 }).map((_, index) => (
                <Form.Group className="mb-3" controlId={`formGroupLicense${index + 1}`} style={{ textAlign: "left" }} key={index}>
                  <Form.Label style={{ fontWeight: "bold" }}>관심 있는 자격증{index + 1}</Form.Label>
                  <Form.Select 
                    aria-label="Default select example"
                    value={licenses[index]} // 현재 상태에 따라 선택값을 설정
                    onChange={(e) => handleSelectChange(index, e.target.value)} // 변경 이벤트 핸들러
                  >
                    <option value="없음">없음</option>
                    <option value="정보처리기사">정보처리기사</option>
                    <option value="빅데이터분석기사">빅데이터분석기사</option>
                    <option value="정보보안기사">정보보안기사</option>
                    <option value="전기기사">전기기사</option>
                    <option value="전기공사기사">전기공사기사</option>
                    <option value="정보관리기술사">정보관리기술사</option>
                  </Form.Select>
                </Form.Group>
              ))}

                
                <Button type="submit" onClick={()=>{

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