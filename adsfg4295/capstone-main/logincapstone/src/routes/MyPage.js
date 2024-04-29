import { getUserName,auth,getLicenseList,getExamScheduleList, getExamFeeList, getLicenseInfoList } from "../firebase/firebase";
import { useState,useEffect } from 'react';
import { getAuth,onAuthStateChanged  } from "firebase/auth"; //인증 기능 
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';

function MyPage(){

    return(
        <>
            <StackedExample></StackedExample>
            <UserNameComponent></UserNameComponent>
        </>
    )
}



function UserNameComponent(){ //현재 로그인 한 사용자의 이름을 출력해줍니다. 
    let[userName,setUserName] = useState(null);

    useEffect(()=>{
        async function fetchUserName(){
            const unsubscrive = onAuthStateChanged(auth,async(user)=>{ //Authentication 잠깐 끊어져도 로그인 상태에서만 작동하도록 설계
                if(user){
                    const name = await getUserName(); //사용자 이름을 비동기적으로 가져옴 
                    setUserName(name);
                }
            })
        }
        fetchUserName();
    },)//컴포넌트 마운트 시 1번만 실행
    if(userName==null) { //로딩 중 
        console.log(userName)
        return <div>Loading...</div>;

    }
    else return <div>{userName}</div>
}//UserNameComponent

function UserImage() {
    return (
      <Container>
        <Row>
          <Col xs={6} md={4}>
            <Image src="holder.js/171x180" roundedCircle/>
          </Col>
        </Row>
        <hr></hr>
      </Container>
      
    );
  }//ShapeExample
  function StackedExample() {
    return (
      <Nav defaultActiveKey="/home" className="flex-column left-nav">
        <Nav.Link href="/home">Active</Nav.Link>
        <Nav.Link eventKey="link-1">Link</Nav.Link>
        <Nav.Link eventKey="link-2">Link</Nav.Link>
        <Nav.Link eventKey="disabled" disabled>
          Disabled
        </Nav.Link>
      </Nav>
    );
  }
  
export default MyPage;