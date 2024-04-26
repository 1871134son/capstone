import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {getLicenseList, signUp} from "../firebase/firebase.js"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {fetchingLicenseList,sortLicenseList} from '../redux/store.js';

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
      const [jmcds,setJmcds] = useState(['empty','empty','empty']); //유저가 원하는 자격증의 코드 값. 없으면 empty. 
      const navigate = useNavigate();
      let dispatch = useDispatch();
      const licenseList = useSelector((state)=> state.licenseList.licenseList)//redux store.js 에서 licenseList 를 가져와준다. 

      useEffect(()=>{
        dispatch(fetchingLicenseList());
      },[dispatch]);

      useEffect(() => {
        // 상태 업데이트 후 licenseList가 업데이트되면 여기에서 확인할 수 있습니다.
        console.log("업데이트된 licenseList -> ", licenseList);
        dispatch(sortLicenseList());  // sortLicenseList 액션을 디스패치
      }, [licenseList]); // licenseList가 변경될 때마다 이 useEffect가 호출됩니다.
    
      const handleSubmit = (event) => { //회원가입 버튼 누르면 
        event.preventDefault();
        if(confirmCheck(password,confirm)){
           signUp(email, password,userName,licenses,jmcds);
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

     const handleSelectChange = (index, value) => { //사용자가 입력한 자격증 이름으로, jmcd값을 찾음. 
      const selectedLicense = licenseList.find(license => license.name === value);
      
      const updatedLicense = [...licenses];
      updatedLicense[index] = value;
      setLicenses(updatedLicense);

      if(selectedLicense){//선택한 값(사용자가 입력한 자격증이름)이 유효하면 jmcd값 업데이트 
        const updatedJmcds = [...jmcds];
        updatedJmcds[index] = selectedLicense.jmcd;
        setJmcds(updatedJmcds);
        console.log(selectedLicense.name, selectedLicense.jmcd);
      }
      else{//만약에 사용자가 입력한 값이 licenseList 안에 없으면,  자격증 코드(jmcd)를 empty로 설정해야함. 
        const updatedJmcds = [...jmcds];
        updatedJmcds[index] = "empty"
        setJmcds(updatedJmcds);
        console.error("선택한 자격증을 찾지 못했습니다.",value);
      }
      console.log(jmcds,licenses);
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
                  <Form.Control 
                    type = "text"
                    list = "license_id"
                    value={licenses[index]} // 현재 상태에 따라 선택값을 설정
                    onChange={(e) => handleSelectChange(index, e.target.value)} // 변경 이벤트 핸들러
                  />
                 <datalist id="license_id">
                    {licenseList &&
                      licenseList.map((license, index) => ( //데이터 리스트에 자격증 정보를 삽입 
                        <option key={index} value={license.name}>{license.name}</option>
                      ))
                    }
                  </datalist>                
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