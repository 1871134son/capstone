import { getUserName,auth,getLicenseList,getExamScheduleList, getExamFeeList, getLicenseInfoList,getLicenseInfo,searchLicenseInfo,
    signInEduNavi,storage,FileUpload,DisplayImage } from "../firebase/firebase";
  import { useState,useEffect } from 'react';
  import { getAuth,onAuthStateChanged  } from "firebase/auth"; //인증 기능 
  import Col from 'react-bootstrap/Col';
  import Container from 'react-bootstrap/Container';
  import Image from 'react-bootstrap/Image';
  import Row from 'react-bootstrap/Row';
  import Nav from 'react-bootstrap/Nav';
  import { useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import {fetchingLicenseList,sortLicenseList} from '../redux/store.js'; 
  import { getStorage,ref,uploadBytes  } from "firebase/storage";

//개발에 필요한 테스트 하는 것들에 대한 컴포넌트를 모아놓은 js 파일입니다. 


/**검색창에 자격증 입력 시, 자격증 정보 객체 받아오는 컴포넌트 */
function SearchLicenseComponent() {
    const auth = getAuth();
    const [searchText, setSearchText] = useState('');
    const licenseList = useSelector((state)=> state.licenseList.licenseList)//redux store.js 에서 licenseList 를 가져와준다. 
    const [licenseInfo, setLicenseInfo] = useState(null);
    const navigate = useNavigate();
    let dispatch = useDispatch();
    
    useEffect(()=>{
      dispatch(fetchingLicenseList());
    },[dispatch]);
    
    useEffect(() => {
      // 상태 업데이트 후 licenseList가 업데이트되면 여기에서 확인할 수 있습니다.
     // console.log("업데이트된 licenseList -> ", licenseList);
      dispatch(sortLicenseList());  // sortLicenseList 액션을 디스패치
    }, [licenseList]); // licenseList가 변경될 때마다 이 useEffect가 호출됩니다.

    useEffect(()=>{
        if(licenseInfo){//licenseInfo가 null이 아닐때만 
            console.log("검색한 자격증 정보 ->",licenseInfo[0]);
            console.log("검색한 자격증 정보 ->",licenseInfo[0].infoData);
            console.log("검색한 자격증 정보 ->",licenseInfo[0].feeData);
            console.log("검색한 자격증 정보 ->",licenseInfo[0].jmcd);
        }
    },[licenseInfo]);

    /**  searchLicenseInfo 비동기 처리를 위한 함수 */
    const handleSearch = async() =>{
        try{
            const result = await searchLicenseInfo(searchText);
            setLicenseInfo(result);
        }
        catch(error){
            console.error("자격증 정보 검색 중 오류 발생:", error);
        }
    };

    return (
      <div>
        <input
          type="text"
          list = "license_id"
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
            }
          placeholder="Enter a message"
        />
        <datalist id="license_id">
          {licenseList &&
            licenseList.map((license, index) => ( //데이터 리스트에 자격증 정보를 삽입 
              <option key={index} value={license.name}>{license.name}</option>
            ))
          }
        </datalist>  
        <button onClick={()=>{
            handleSearch();
        }}>자격증 정보 검색</button>
         <button onClick={()=>{
            getExamFeeList();
        }}>자격증응시료찍기</button>
         <button onClick={()=>{
            signInEduNavi();
        }}>에듀나비로 로그인</button>
      </div>
    );
  }//SearchLicenseComponent()

  /**현재 로그인 한 사용자의 이름을 디스플레이 하는 컴포넌트 */
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

  export {UserImage, UserNameComponent, SearchLicenseComponent};