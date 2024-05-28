import { getUserName,auth,getLicenseList,getExamScheduleList, getExamFeeList, getLicenseInfoList,getLicenseInfo,searchLicenseInfo,
    signInEduNavi,storage,FileUpload,DisplayImage,getNotificationsList } from "../firebase/firebase";
  import { useState,useEffect } from 'react';
  import { getAuth,onAuthStateChanged  } from "firebase/auth"; //인증 기능 
  import Col from 'react-bootstrap/Col';
  import Image from 'react-bootstrap/Image';
  import Row from 'react-bootstrap/Row';
  import { Route, useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import {fetchingLicenseList,sortLicenseList} from '../redux/store.js'; 
  import { getStorage,ref,uploadBytes  } from "firebase/storage";
  import { Navbar, Nav, Dropdown, Badge, Button, Container } from 'react-bootstrap';
  import { Bell } from 'react-bootstrap-icons';
  import './stuff.css';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { faSearch } from '@fortawesome/free-solid-svg-icons';
  import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBBreadcrumb,
    MDBBreadcrumbItem,
    MDBProgress,
    MDBProgressBar,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem
  } from 'mdb-react-ui-kit';
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
        
    },[licenseInfo]);

    /**  searchLicenseInfo 비동기 처리를 위한 함수 */
    const handleSearch = async() =>{
        try{
            const result = await searchLicenseInfo(searchText);
            setLicenseInfo(result);
            console.log("stuff.js 62-> ",licenseInfo);
            navigate(`./licenseInfoPage/${licenseInfo[0].jmcd}`, {state: {licenseInfo: licenseInfo[0]}}); //해당 페이지로 이동한다. 
         /* 원래 코드 속도 테스트중 
            if(licenseInfo){//licenseInfo가 null이 아닐때만 
              console.log("null검사완료 ",licenseInfo);
                navigate(`./licenseInfoPage/${licenseInfo[0].jmcd}`, {state: {licenseInfo: licenseInfo[0]}}); //해당 페이지로 이동한다. 
            } 
            */
        }
        catch(error){
            console.error("자격증 정보 검색 중 오류 발생:", error);
        }
    };

    return (
      <div>
        <input
          type="text"
          list="license_id"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="자격증 검색"
          className="search-input" // 스타일 적용을 위해 클래스 추가
        />
        <datalist id="license_id">
          {/* 자격증 리스트 옵션 */}
        </datalist>
        <button
          onClick={handleSearch}
          className="search-button" // 스타일 적용을 위해 클래스 추가
        >
         <FontAwesomeIcon icon={faSearch} />
        </button>
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

  function NotificationBell(){
    const [user, setUser] = useState(null);  // Firebase 사용자 객체를 저장할 상태
    const [notifications, setNotifications] = useState([]);
    
    //인증 상태 감지 
    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);  // 사용자 상태 업데이트
      });
      return () => unsubscribe();  // 컴포넌트 언마운트 시 구독 해제
  }, []);
  
    
    useEffect(() => {
      if (user) {
          async function getNotifications() {
              const notiList = await getNotificationsList();
              setNotifications(notiList);
          }
          getNotifications();
      } else {
          setNotifications([]);  // 로그아웃 상태에서는 알림을 비움
      }
  }, [user]);  // user 상태가 변경될 때마다 이 useEffect가 실행됨
  
  const handleClearNotifications = () => {
    setNotifications([]);
  };
  
  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return '';
  };
  
  return (
      <div className="notification-bell">
      <Dropdown alignRight>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          <Bell size={24} style={{color:"black"}} />
          {notifications.length > 0 && (
            <Badge pill bg="danger" className="ml-2">
              {notifications.length}
            </Badge>
          )}
        </Dropdown.Toggle>
  
        <Dropdown.Menu>
          {notifications.length === 0 ? (
            <Dropdown.Item>알람이 없습니다.</Dropdown.Item>
          ) : (
            notifications.map((notification, index) => (
              <Dropdown.Item  key={index}>
                {formatDate(notification.date)}::  {notification.message}
              </Dropdown.Item>
            ))
          )}
          <Dropdown.Divider />
          <Dropdown.Item as="button" onClick={handleClearNotifications}>
            알람 지우기
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      </div>
    );
  };
  

  export {UserImage, UserNameComponent, SearchLicenseComponent,NotificationBell};
