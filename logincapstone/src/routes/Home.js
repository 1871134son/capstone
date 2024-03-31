import { getUserName,auth,getLicenseList,getExamScheduleList, getExamFeeList, getLicenseInfoList } from "../firebase/firebase";
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

function UserNameComponent(){
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

//const sendMEssage
      const sendMessage = async (message) =>{/////안됨.
        if(!message){
            console.error("message empty!");
        }//ifEnd

        try{
            //Cloud Functions 의 addmessage 엔드포인트로 POST 요청을 보냅니다. 
            const response = await fetch("https://addmessage-gpmqc3at3q-uc.a.run.app",{
                method: "POST", //HTTP 매서드를 POST로 설정함. 
                headers:{
                    "Content-Type" : "application/json" //요청 본문이 JSON임을 명시함. 
                },
                body: JSON.stringify({text:message}) //요청 본문에 메시지 데이터 포함. 
            });
            const data = await response.json();//응답 온거를 json으로 파싱
            //서버로부터 응답 처리 
            console.log(data);
        }//tryEnd
        catch(error){
            console.error("Error sending message ", error);
        }
      }//sendMessage

      
      const getLicense = async()=>{  //이 형식대로 cloud function을 호출해야함. 
        const functions = getFunctions();
        const getLicenseList = functions.httpsCallable("getLicenseList");
        console.log("호출합니다.1");
        getLicenseList()
        .then((result)=>{
             // Read result of the Cloud Function.
             const data = result.data;
            console.log("Result of cf:"+data);
        })
      }
      

      const sendMessage2 = async (message) =>{
        if(!message){
            console.error("message empty!");
        }//ifEnd

        try{
            //Cloud Functions 의 addmessage 엔드포인트로 POST 요청을 보냅니다. 
            const response = await fetch("https://addmessage-gpmqc3at3q-uc.a.run.app?text="+message);
            const data = await response.json();//응답 온거를 json으로 파싱
            //서버로부터 응답 처리 
            console.log(data);
        }//tryEnd
        catch(error){
            console.error("Error sending message ", error);
        }
      }//sendMessage

  
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
            getLicenseInfoList();
        }}>자격증정보로그에찍기</button>
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