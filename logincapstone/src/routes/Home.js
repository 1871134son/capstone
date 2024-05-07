import { getUserName,auth,getLicenseList,getExamScheduleList, getExamFeeList, getLicenseInfoList,saveMajorToFireStore } from "../firebase/firebase";
import { useState,useEffect } from 'react';
import { getAuth,onAuthStateChanged  } from "firebase/auth"; //인증 기능 
import axios from "axios";
import { getFunctions, httpsCallable } from "firebase/functions";


function HomePage(){
    const [userToken,setUserToken] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
          if (user) {
            // 사용자가 로그인한 상태
            user.getIdToken().then((idToken) => {
                setUserToken(idToken);
            });
            // 여기서 UI 업데이트 또는 상태 관리 로직 구현
          } else {
            // 사용자가 로그아웃한 상태
            // 로그인 화면으로 리다이렉트 등의 로직 구현
          }
        });
     
    }, []);
    return(
        <>
            <UserNameComponent></UserNameComponent>
            <AddMessage userToken={userToken}></AddMessage>

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

/*Cloud Functions 작동 확인용 연습용 컴포넌트입니다.*/
function AddMessage(props) {
    const auth = getAuth();
    const [text, setText] = useState('');

    return (
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) =>
             setText(e.target.value)
            }
          placeholder="Enter a message"
        
        />
        <button onClick={()=>{

}}>학과저장</button>
         <button onClick={()=>{
            getExamFeeList();
        }}>자격증응시료찍기</button>
         <button onClick={()=>{
            getExamScheduleList();
        }}>자격증시험일정로그에찍기</button>
      </div>
    );
  }//AddMessage()
  

export default HomePage;