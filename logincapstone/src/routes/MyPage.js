import { getUserName,auth,getLicenseList,getExamScheduleList, getExamFeeList, getLicenseInfoList,getLicenseInfo,searchLicenseInfo,
  signInEduNavi,storage,FileUpload,DisplayImage,getUserInfo,fetchMajorList,updateUserProfile,LogOutButton } from "../firebase/firebase";
import { useState,useEffect } from 'react';
import { getAuth,onAuthStateChanged  } from "firebase/auth"; //인증 기능 
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {fetchingLicenseList,sortLicenseList} from '../redux/store.js'; 
import { getStorage,ref,uploadBytes  } from "firebase/storage";
import {SearchLicenseComponent, UserNameComponent, NotificationBell} from "../testStuff/stuff.js";


  import { Form, Button, Container, Row, Col, Card, Navbar } from 'react-bootstrap';


 
function MyPage(){

    return(
        <>
       <UserProfile></UserProfile>
        
        </>
    )
}

function MajorListDisplay({ majorList }) {
    return (
      <div>
        <h3>추천 자격증/시험 목록</h3>
        <ul>
          {majorList&&
          majorList.map((major, index) => (
            <li key={index}> {index+1} . {major}</li> // `name` 속성을 가정하여 리스트를 만듦 
            
          ))}
        </ul>
      </div>
    );
  }//MajorListDisplay
function UserProfile(){
    const [majorList,setMajorList] = useState([]); //학과리스트를 저장할 state
    const [user, setUser] = useState(null);  // Firebase 사용자 객체를 저장할 상태
    const [loading, setLoading] = useState(true);  // 로딩 상태 추가

//인증 상태 감지 
useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);  // 사용자 상태 업데이트
    });
    return () => unsubscribe();  // 컴포넌트 언마운트 시 구독 해제
}, []);

    // 사용자가 선택한 학과에 따른 데이터를 가져온다. 
    useEffect(() => {
      if (user) {
          async function getuserDocInfo() {
              const info = await getUserInfo();
              setMajorList(info.majorLicenses);
          }
          getuserDocInfo();
      } else {
        setMajorList([]);  // 로그아웃 상태에서는  비움
      }
  }, [user]);  // user 상태가 변경될 때마다 이 useEffect가 실행됨


    
    return(
        <>
       <NotificationBell></NotificationBell>
        {/* 메인 컨텐츠 영역 */}
        <Container style={{ marginTop: '60px' }}>
          <Row>
            {/* 사용자 정보 Card */}
              <Card>
                <Card.Header>
                <h3>사용자 정보{<UserNameComponent style={{}}></UserNameComponent>}</h3>
                </Card.Header>
                <Card.Body>
                  {/* 사용자 정보 관련 내용 추가 */}
                  <DisplayImage folderName="userImage" fileName = {`user.png`}  style={{ width: '250px' }}
                    className="rounded-circle"></DisplayImage>
                    
                    {majorList.length > 0 ? <MajorListDisplay majorList={majorList} /> : <p>No majors found</p>}

                </Card.Body>
              </Card>
  
            {/* 프로필 편집 컴포넌트 */}
            <Col md={6}>
              <EditProfile />
            </Col>
          </Row>
          <LogOutButton ></LogOutButton>
        </Container>
      </>
    );
}//userProfile End


function EditProfile() {
  // 상태 관리를 위해 useState 훅 사용, 초기값은 모든 필드가 비어 있는 상태
  const [user, setUser] = useState(null);  // Firebase 사용자 객체를 저장할 상태
  const [majorList,setMajorList] = useState([]); //학과리스트를 저장할 state

  //------------------------------------------자격증, 학과 리스트를 가져오는 과정------------------------------------------------------
  const licenseList = useSelector((state)=> state.licenseList.licenseList)//redux store.js 에서 licenseList 를 가져와준다. 
  let dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchingLicenseList());
  },[dispatch]);

  useEffect(() => { //firebase DB에서 학과에 대한 정보들을 가져옵니다. 
    async function loadMajorList() {
      try {
        const majors = await fetchMajorList();
        majors.sort((a,b)=> a.name.localeCompare(b.name,'ko-KR')); //한글 정렬 
        setMajorList(majors);
      } catch (error) {
        console.error("majorList를 가져오는데 실패했습니다.", error);
        // 에러 처리 로직
      }
    }
    loadMajorList();
  }, []);


  useEffect(() => {
    // 상태 업데이트 후 licenseList가 업데이트되면 여기에서 확인할 수 있습니다.
    //console.log("업데이트된 licenseList -> ", licenseList);
    dispatch(sortLicenseList());  // sortLicenseList 액션을 디스패치
  }, [licenseList]); // licenseList가 변경될 때마다 이 useEffect가 호출됩니다.

  //------------------------------------------자격증, 학과 리스트를 가져오는 과정------------------------------------------------------


  const [profile, setProfile] = useState({
    userName: '',
    email: '',
    license1: '',
    license2: '',
    major: '',
    jmcds: [],
    majorLicenses: []
  });



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
          async function getuserDocInfo() {
              const info = await getUserInfo();
              setProfile({
                userName: info.userName,
                email: info.email,
                license1: info.licenses[0],
                license2: info.licenses[1],
                major: info.major,
                jmcds: info.jmcds,
                majorLicenses: info.majorLicenses
              });
          }
          getuserDocInfo();
      } else {
        setProfile({  
            userName: '',
            email: '',
            license1: '',
            license2: '',
            major: '',
            jmcds: [],
            majorLicenses: []});  // 로그아웃 상태에서는  비움
      }
  }, [user]);  // user 상태가 변경될 때마다 이 useEffect가 실행됨
  
// 자격증 코드 배열(jmcds) 업데이트
useEffect(() => {
    const newJmcds = [];
    
    // license1과 license2의 jmcd를 찾아 배열에 추가
    const license1Detail = licenseList.find(license => license.name === profile.license1);
    const license2Detail = licenseList.find(license => license.name === profile.license2);
    if (license1Detail) newJmcds.push(license1Detail.jmcd);
    if (license2Detail) newJmcds.push(license2Detail.jmcd);
  
    setProfile(prev => ({
      ...prev,
      jmcds: newJmcds
    }));
  }, [profile.license1, profile.license2, licenseList]);
  
  // 학과별 추천 자격증 배열(majorLicenses) 업데이트
  useEffect(() => {
    const majorDetail = majorList.find(major => major.name === profile.major);
    const newMajorLicenses = majorDetail ? majorDetail.list : [];
  
    setProfile(prev => ({
      ...prev,
      majorLicenses: newMajorLicenses
    }));
  }, [profile.major, majorList]);

  // 입력 필드 변경 시 호출되는 함수, 변경된 값을 상태에 반영
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value // 입력 필드에 따라 적절한 상태 업데이트
    }));

  };

  // 폼 제출 시 호출되는 함수, 현재 상태를 콘솔에 출력하고 API로 데이터 전송 가능
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 기본 이벤트 방지
  
    // 사용자가 입력한 데이터 요약
    const userDataSummary = `
      이름: ${profile.userName}\n
      이메일: ${profile.email}\n
      관심있는 자격증 1: ${profile.license1}\n
      관심있는 자격증 2: ${profile.license2}\n
      학과: ${profile.major}
    `;
  
        if(user){
        // 확인 대화상자에 입력 데이터 표시
        const confirmUpdate = window.confirm("입력한 정보로 프로필을 업데이트할까요?\n\n" + userDataSummary);
      
        if (confirmUpdate) {
          // 사용자가 '확인'을 누른 경우, 프로필 업데이트 로직 실행
          console.log('Profile Updated:', profile);
          updateUserProfile(profile);
          // API 호출 로직 추가 예정
        } else {
          // 사용자가 '취소'를 누른 경우, 아무 것도 하지 않음
          console.log('Profile update cancelled.');
        }
      }//if 
          else{
            alert("로그인 후 이용 가능한 서비스입니다.");
          }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <Form onSubmit={handleSubmit}>
            <h2>Edit Profile</h2>
            {/* 각 입력 필드는 Form.Group 내에 배치 */}
            
            <Form.Group className="mb-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="userName"
                name="userName"
                value={profile.userName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address {"(수정불가)"}</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email2"
                value={profile.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>관심있는 자격증 1</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first license"
                name="license1"
                list = "license_id"
                value={profile.license1}
                onChange={handleChange}
              />
                 <datalist id="license_id">
                    {licenseList &&
                      licenseList.map((license, index) => ( //데이터 리스트에 자격증 정보를 삽입 
                        <option key={index} value={license.name}>{license.name}</option>
                      ))
                    }
                  </datalist>        
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>관심있는 자격증 2</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter second license"
                name="license2"
                list = "license_id"
                value={profile.license2}
                onChange={handleChange}
              />
              
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>학과</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter major"
                name="major"
                list = "major_id"
                value={profile.major}
                onChange={handleChange}
              />
              <datalist id="major_id">
                    {majorList &&
                      majorList.map((major, index) => ( //데이터 리스트에 자격증 정보를 삽입 
                        <option key={index} value={major.name}>{major.name}</option>
                      ))
                    }
                  </datalist> 
            </Form.Group>
            {/* 제출 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
                <Button variant="primary" type="submit">
                    Update Profile
                </Button>
                </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}//EditProfile End
  
  

  
export default MyPage;