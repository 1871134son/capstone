// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword   } from "firebase/auth"; //인증 기능 
import {getFirestore,doc, setDoc,getDoc, collection, addDoc,getDocs, query, where, orderBy, deleteDoc, updateDoc} from "firebase/firestore"; //firebase cloud firestore 기능 
import { getFunctions, httpsCallable } from "firebase/functions";
import { getStorage,ref,uploadBytes,getDownloadURL  } from "firebase/storage";
import { format } from 'date-fns';
import { Alert } from "bootstrap";
import React, { useState, useEffect } from 'react';

//import { db } from './firebase';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// firebaseConfig 절대 수정 금지 
const firebaseConfig = {
  apiKey: "AIzaSyBDYtOc-dIWJTJjYBg-dBnpmABqbdr2xMI",
  authDomain: "licenseweb-82277.firebaseapp.com",
  projectId: "licenseweb-82277",
  storageBucket: "licenseweb-82277.appspot.com",
  messagingSenderId: "163580487113",
  appId: "1:163580487113:web:88bca16ee12344a2c17418",
  measurementId: "G-L2V2XNQ9WY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
const analytics = getAnalytics(app);

// Firebase 인증 객체를 초기화합니다.
const auth = getAuth(app);
const db = getFirestore(app);
//Navigate사용 
const storage = getStorage(app);

/** 파일을 업로드 하는 컴포넌트. */
function FileUpload({folderName, fileName}) {
  const [file, setFile] = useState(null);

  // 파일을 선택하는 함수
  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };
//------------------------------------------------------------------------------Storage-------------------------------------------------------------------------
  // 파일을 Firebase Storage에 업로드하는 함수
  const handleUpload = () => {//folderName폴더에 fileName을 업로드함. 
    if (file) { //사용자가 파일을 선택했나 확인함. 
      const storage = getStorage(); 
      const storageRef = ref(storage, `${folderName}/${fileName}`); //storageRef -> 업로드 할곳(폴더) 와 업로드할 파일의 이름 설정 
      //호출할때 지정한 폴더와, 파일 이름으로 업로드 됩니다. 
      //같은 폴더의, 같은 이름으로 올리게 되면 수정 됨. 

      uploadBytes(storageRef, file).then((snapshot) => { //storageRef 에 file을 업로드합니다.  
        console.log('파일이 성공적으로 업로드되었습니다!');
        alert("업로드 성공!")
      }).catch((error) => {
        console.error('업로드 중 오류 발생:', error);
        alert("업로드 중 오류 발생!");
      });
    } else {//사용자가 아직 파일을 선택하지 않았음. 
      alert("파일을 선택해주세요!");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} accept="image/*"/>
      <button onClick={handleUpload}>업로드하기</button>
    </div>
  );
}//FileUpload

/** 이미지를 디스플레이 해주는 컴포넌트 */
function DisplayImage({folderName,fileName}) {//forlderName 아래, 있는 fileName 이미지를 디스플레이한다. 
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Firebase 스토리지 인스턴스를 가져옵니다.
    const storage = getStorage();
    // 'testFolder/test.jpg' 위치의 참조를 만듭니다.
    const imageRef = ref(storage, `${folderName}/${fileName}`);

    // 다운로드 URL을 얻어옵니다.
    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);  // URL을 상태에 저장하여 이미지로 사용할 수 있게 합니다.
      })
      .catch((error) => {
        console.error('이미지를 불러오는 중 오류 발생:', error);
      });
  }, []);  // 의존성 배열이 비어 있으므로 컴포넌트 마운트 시 한 번만 실행됩니다.

  return (
    <div>
      {imageUrl ? <img src={imageUrl} alt="Uploaded" /> : <p>Loading...</p>}
    </div>
  );
}//DisplayImage



//------------------------------------------------------------------------------Storage-------------------------------------------------------------------------




//사용자 회원가입 시, license name, jmcd 값을 user collection의 codument에 필드 값을 추가해서 저장함. 
//현재 사용자의 jmcd 값을 저장, 적합한 값이 있으면, 그만큼 함수를 호출, 그리

//---------------------------------------------------------------------------인증 관련(Authentication)-------------------------------------------------------------------------


async function signIn(email, password) {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in user:", userCredential.user);
      // 로그인 성공 후 처리
      alert("로그인성공!");
    } catch (error) {
      console.error("Error signing in:", error);
      // 로그인 실패 시 처리
      alert("아이디 및 패스워드 오류!");
    }
  }//Sign In End 

/**임시 함수입니다, 로그인 버튼 복구하면 삭제 */
  async function signInEduNavi(email, password) {
    const auth = getAuth();
    email = "edunavi@gmail.com";
    password = "12345678";
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in user:", userCredential.user);
      // 로그인 성공 후 처리
      alert("로그인성공!");
    } catch (error) {
      console.error("Error signing in:", error);
      // 로그인 실패 시 처리
      alert("아이디 및 패스워드 오류!");
    }
  }//Sign In End 

  async function getUserName() {
      
        const user = auth.currentUser;
        // 사용자가 로그인한 경우
        if (user) {
          // 'users' 컬렉션에서 현재 사용자의 uid와 일치하는 문서를 조회합니다.
          const userRef = doc(db, "user", user.uid);
          const docSnap = await getDoc(userRef);
      
          if (docSnap.exists()) {
            // 문서에서 'name' 필드(사용자 이름)를 가져와 출력합니다.
            console.log("User name:", docSnap.data().userName);
            return docSnap.data().userName;
          } else {
            // 문서가 존재하지 않는 경우
            console.log("유저 정보가 존재하지 않습니다.");
            return null;
          }
        } else {
          // 사용자가 로그인하지 않은 경우
          console.log("No user logged in");
          return null;
        }
      
    
  }//getUserName()
  

async function signUp(email,password,userName,licenses,jmcds,major,majorLicenses){
    try{
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;

      /* DB 콜렉션에 유저 정보들 저장, uid로 document 생성 */
      await setDoc(doc(db,"user",user.uid),{
        userName: userName,
        licenses: licenses,
        email : email,
        jmcds : jmcds,
        major : major,
        majorLicenses : majorLicenses
      });

      console.log('User created successfully with email:', user.email);
      alert("회원가입을 축하드립니다!");
    } catch (error) {
      console.error('Error creating user:', error);
      // 에러 처리 로직을 여기에 작성합니다.
    }//catch 
  }//Sign Up end 

//---------------------------------------------------------------------------인증 관련(Authentication)-------------------------------------------------------------------------





//--------------------------------------------------------------------------게시판(시작)------------------------------------------------------------------------------

  //글 작성 완료하면 firebase에 등록
 async function boardSave(brdno, title, content, brddate, brdwriter){
  try{
    const user = auth.currentUser;

    if (!brdno) {
      /* 새로운 게시글 생성 */
      const postCollection = collection(db, "post");
      
      //const currentDate = new Date().toISOString();
      const docRef = await addDoc(postCollection, {
         // brdno: docRef.id,
          uid: user.uid,
          title: title,
          content: content,
          brddate: brddate,
          brdwriter: brdwriter,
      });
      await setDoc(doc(db, 'post', docRef.id), { brdno: docRef.id }, { merge: true });
      console.log("New post added with ID: ", docRef.id);
      
  }else{
    //update
    const postRef = doc(db, "post", brdno);
    await setDoc(postRef, {
        title: title,
        content: content,
        brddate: brddate,
        brdwriter: brdwriter,
    });
    console.log("Post updated with ID: ", brdno);
  }
 
  } catch (error) {
    console.error('Error saving user:', error);
    
  }//catch 

}


//파이어베이스에서 게시물 데이터를 가져오는 함수
export const fetchPostsFromFirebase = async () => {
  try {
    const q = query(collection(db, 'post'), orderBy('brddate', 'desc')); // 'post' 컬렉션에서 brddate 필드를 기준으로 내림차순으로 정렬하여 데이터 가져오기
    const postsSnapshot = await getDocs(q); // 쿼리 실행하여 데이터 가져오기
    const postsData = postsSnapshot.docs.map(doc => doc.data());
    console.log("게시글 정보:", postsData);
    return postsData;
  } catch (error) {

    
    console.error('Error fetching posts from Firebase:', error);
    return [];
  }
};



export const getPostByNoFromFirebase = async (brdno) => {
  try {
    const postDocRef = doc(db, "post", brdno); // "posts" 컬렉션에서 해당 게시글 번호에 해당하는 문서 가져오기
    const postDocSnapshot = await getDoc(postDocRef); // 문서 스냅샷 가져오기

    
    if (postDocSnapshot.exists()) {
      // 문서가 존재하는 경우 데이터 반환
      return postDocSnapshot.data();
    } else {
      // 문서가 존재하지 않는 경우 null 반환 
      return null;
    }
  } catch (error) {
    console.error("Error getting post by number from Firebase:", error);
    throw error; // 에러 처리
  }
};


//글 삭제
export const deletePostFromFirebase = async (brdno) => {
  try {
    // 삭제할 게시물의 문서 참조를 가져옵니다.
    const postRef = doc(db, 'post', brdno); // 'post' 컬렉션에서 brdno를 ID로 갖는 문서를 참조합니다.

    // 문서를 삭제합니다.
    await deleteDoc(postRef);

    console.log('게시물 삭제 성공');
  } catch (error) {
    console.error('게시물 삭제 오류:', error);
    throw error; // 오류를 호출자에게 전파합니다.
  }
};


//글 수정
export const updatePostInFirebase = async (brdno, newData) => {
  try {
    const postRef = doc(db, "post", brdno); // "post" 컬렉션에서 해당 게시물 문서 가져오기
    await updateDoc(postRef, newData); // 문서 업데이트
    console.log("게시물 업데이트 성공");
  } catch (error) {
    console.error("게시물 업데이트 오류:", error);
    throw error;
  }
};
  

//--------------------------------------------------------------------------게시판(종료)------------------------------------------------------------------------------






//--------------------------------------------------------------------------자격증 관련(시작)------------------------------------------------------------------------------


async function getLicenseList(){//국가기술자격 목록에서 자격증 목록만 가져와서 firebase DB에 저장.
    try{
      const functions =getFunctions(app,"us-central1");
      const getLicense = httpsCallable(functions,"getLicenseList2");
        console.log("getLicenseList() 호출");
        const result = await getLicense()
        .then((result)=>{
             // Read result of the Cloud Function.
             const jsonResult = result.data.xmlData; //xmlData--> JSON형태임. 
             const jsonData = JSON.parse(jsonResult);//JSON에서 자바스크립트 객체로 파싱.
             const licneseNameValue = jsonData.response?.body?.items?.item.map(item => item.jmfldnm); //옵셔널 채이닝, 데이터가 아직 준비되지 않았을 때 안전한 처리를 함. 
             const licenseJmcdValue = jsonData.response?.body?.items?.item.map(item => String(item.jmcd)); //과목 코드 jmcd값을 추출
             //이유는 모르겠는데, String() 안하면, 몇개는 정수로 몇개는 문자열로 저장됨. 
             saveLicenseToFireStore(licneseNameValue, licenseJmcdValue);
            })
    }
    catch(error){
      const code = error.code;
      const message = error.message;
      const details = error.details;
      console.error("getLicenseList/fireabase.js : "+error+code+message+details);
      
    }
}//end getLicenseList()

async function saveLicenseToFireStore(licenseList, licenseJmcdValue){ //자격증 리스트를 Firebase DB에 저장합니다. 
  const licenseCollection = collection(db,"license"); //license collection reference
  for(let i =0; i<licenseList.length; i++){
    try{
      const docRef = await addDoc(licenseCollection,{
        name: licenseList[i],
        jmcd: licenseJmcdValue[i]
      });
      console.log("firebase.js 133: Document written with ID", docRef.id);
    }catch(error){
      console.error("Error adding document LicenseList: ",error);
    }
  }
}//saveLicenseToFireStore END


async function saveMajorToFireStore(){ //자격증 리스트를 Firebase DB에 저장합니다. 
  const majorList = [
    "컴퓨터공학과", "기계공학과", "전기공학과", "전자공학과",
    "화학공학과", "건축공학과", "토목공학과", "산업공학과",
    "의학과", "간호학과", "경영학과", "경제학과",
    "심리학과", "생명과학과", "화학과", "물리학과",
    "수학과", "통계학과", "정치외교학과", "법학과",
    "사회학과", "역사학과", "영어영문학과", "국어국문학과",
    "철학과", "체육학과", "미술학과", "음악학과",
    "생물학과", "재료공학과", "식품공학과", "조경학과",
    "도시공학과", "환경공학과", "정보통신공학과", "자동차공학과",
    "항공우주공학과", "로봇공학과", "해양공학과", "생명공학과",
    "바이오공학과", "안전공학과", "에너지공학과", "지구과학과",
    "조선해양공학과", "광고홍보학과", "국제학과", "농학과",
    "수의학과", "약학과"
];
  const majorCollection = collection(db,"major"); //license collection reference
  for(let i =0; i<majorList.length; i++){
    try{
      const docRef = await addDoc(majorCollection,{
        name: majorList[i],
      });
      console.log("학과추가완료", docRef.id);
    }catch(error){
      console.error("Error adding document major: ",error);
    }
  }
}//saveLicenseToFireStore END

async function fetchLicenseList(){ //fireStore에서 db정보를 가져와서 배열을 반환
  const licenseList =[
  
  ];
  try{
    const querySnapShot = await getDocs(collection(db,"license"));
    querySnapShot.forEach((doc) => {
      let docData = doc.data();//문서의 데이터 객체 가져옴.
      licenseList.push(docData); //객체 배열에 저장 
    });
    //console.log("fetchLicenseList 성공!:", licenseList);
  }catch(error){
    console.error("fetchLicenseList 에러: ",error);
  }
  return licenseList;//배열을 반환한다. 
}


async function fetchMajorList(){ //fireStore에서 db정보를 가져와서 배열을 반환
  const majorList =[
  
  ];
  try{
    const querySnapShot = await getDocs(collection(db,"major"));
    querySnapShot.forEach((doc) => {
      let docData = doc.data();//문서의 데이터 객체 가져옴.
      majorList.push(docData); //객체 배열에 저장 
    });
    console.log("fetchmajorList 성공!:", majorList);
  }catch(error){
    console.error("fetchmajorList 에러: ",error);
  }
  return majorList;//배열을 반환한다. 
}

async function getExamScheduleList(){//jmcd값을 인자로 넘겨주고, 받은 JSON데이터를 파싱 후 리턴 
  console.log("getExamScheduleList 호출");
  const user = auth.currentUser;
  let scheduleList =[]; //자격증들에 대한 시험정보를 담는 배열. schedule 로 이루어짐. 
  if(user){//로그인 상태 
    //console.log("firebase.js/fetExamScheduleList()-> 사용자로그인상태");
    const userRef = doc(db,"user",user.uid); 
    const docSnap = await getDoc(userRef);
    if(docSnap.exists()){//해당하는 유저의 정보가 DB에 있을 떄 
      const jmcds = docSnap.data().jmcds;
      for(let i=0; i<jmcds.length; i++){ 
        if(jmcds[i]=="empty"){//empty는 회원이 관심있는 자격증이 없는 경우므로 함수를 시행하지 않음. 
        }
        else{
          try{
            const functions =getFunctions(app,"us-central1");
            const getExamSchedule = httpsCallable(functions,"getExamSchedule"); 
              //console.log("getExamSchedule() 호출",i,"번째");
              const result = await getExamSchedule({jmcd:jmcds[i]}); //await 므로, then 안쓰고 바로 사용가능 
                   // Read result of the Cloud Function. 
              const jsonResult = result.data.dataText; // JSON형태임. 
              const jsonData = JSON.parse(jsonResult);//JSON에서 자바스크립트 객체로 파싱.
            //  console.log("firebase.js -> getExamSchedule() -> jsonData ", jsonData);          
              
              //items가 배열이 아니면 배열로 만드는 처리. 데이터가 전부 배열이 아니네용..
              const items = jsonData.response?.body?.items?.item;
              const normalizedItems = Array.isArray(items) ? items : [items];
              
              if(!jsonData.response?.body?.items?.item){
                //return []; //빈 배열 리턴 
              }
              else{ //자격증마다 비어있는 필드가 있어서 예외처리를 해줍니다. 
                const schedule = normalizedItems.map(item =>({ //schedule -> 자격증 1개에 대한 정보. 
                  /**필기시험종료일자*/
                  docExamEndDt: item.docexamenddt ? String(item.docexamenddt): " ",
                  /**필기시험시작일자*/
                  docExamStartDt: item.docexamstartdt ? String(item.docexamstartdt):" ",
                  /**필기시험 합격(예정)자 발표일자*/
                  docPassDt: item.docpassdt ? String(item.docpassdt):" ",
                  /**필기시험원서접수 종료일자*/
                  docRegEndDt: item.docregenddt ? String(item.docregenddt):" ",
                  /**필기시험원서접수 시작일자*/
                  docReStartDt: item.docregstartdt ? String(item.docregstartdt):" ",
                  /**응시자격서류제출 종료일자*/
                  docSubmitEndDt: item.docsubmitenddt ? String(item.docsubmitenddt):" ",
                  /**응시자격서류제출 시작일자*/
                  docSubmitStartDt: item.docsubmitstartdt ? String(item.docsubmitstartdt):" ",
                  /**시험 회차정보 ex.2024년 정기 기사 1회 */
                  nameOfExam: item.implplannm ? String(item.implplannm):" ",
                  /**자격증 이름 */
                  nameOfLicense: item.jmfldnm ? String(item.jmfldnm):" ",
                  /**중직무분야 코드 ex.211 */
                  mdobligfldCode: item.mdobligfldcd ? String(item.mdobligfldcd):" ",
                  /**중직무분야 이름 ex. 정보기술 */
                  mdobloffldName: item.mdobloffldnm ? String(item.mdobloffldnm):" ",
                  /**대직무분야 코드 ex. 21 */
                  obligfldCode: item.obligfldcd ? String(item.obligfldcd):" ",
                  /**대직무분야 이름 ex. 정보통신  */
                  obligfldName: item.obligfldnm ? String(item.obligfldnm):" ",
                  /**실기시험 종료 일자 */
                  pracExamEndDt: item.pracexamenddt ? String(item.pracexamenddt):" ",
                  //**실기시험 시작 일자 */
                  pracExamStartDt: item.pracexamstartdt ? String(item.pracexamstartdt):" ",
                  /**합격자발표 종료일자 */
                  pracPassEndDt: item.pracpassenddt ? String(item.pracpassenddt):" ",
                  /**합격자발표 시작일자 */
                  pracPassStartDt: item.pracpassstartdt ? String(item.pracpassstartdt):" ",
                  /**실기시험원서접수 종료일자*/
                  pracCreEndDt: item.pracregenddt ? String(item.pracregenddt):" ",
                  /**실기시험원서접수 시작일자 */
                  pracCreStartDt: item.pracregstartdt ? String(item.pracregstartdt):" "
                }));
              scheduleList.push(schedule);
              }//else
          }//try
          catch(error){
            const code = error.code;
            const message = error.message;
            const details = error.details;
            console.error("getExamScheduleList/fireabase.js : "+error+code+message+details);
          }//catch
        }
      }//for
      return scheduleList;
    }//if
    else{ //DB에 정보 없을 때 
      console.log("DB에 유저 정보가 없습니다! 운영팀에 문의주세요");
    }//else
  }//if user End 
  else{//사용자 로그인 안한 상태 
    console.log("사용자가 로그아웃 상태입니다. 로그인 해주세요");
  }//else user End 
}//end getExamScheduleList

/**
//사용자가 입력한 자격증 이름을 검색한다 
 */
async function searchLicenseInfo(licenseName){
  //이름으로 license db에서 jmcd정보 찾기 
  const licenseData = [];
 const licenseCol = collection(db, "license"); //license 컬렉션 참조 
 const q = query(licenseCol, where("name","==", licenseName)); // 쿼리 생성

 try{
  const querySnapShot = await getDocs(q); //license 콜렉션에서 licenseName에 해당하는 쿼리를 가져옴 
  if(querySnapShot.empty){
    alert("검색어를 다시 확인해주세요. 현재는 국가자격증만 검색 가능합니다.");
  }else{
    console.log("자격증 찾음");
    querySnapShot.forEach(doc => {
      const jmcd = doc.data().jmcd;
      const infoData =  getLicenseInfo(jmcd);  //자격증 정보 가져오기 
      const feeData = getLicenseFee(jmcd);    // 자격증 시험 비용 가져오기 
      licenseData.push(feeData);
      licenseData.push(infoData);
      return licenseData; //자격증에 대한 정보를 전달한다. 
    });
  }//else
 }
 catch(error){
  console.error("license 검색에 오류 발생",error);
 }

}

/** 자격증 정보를 공공데이터 API에서 받아온다. */
async function getLicenseFee(jmcd){
  let feeList = [];
  try{
    const functions =getFunctions(app,"us-central1");
    const getFee = httpsCallable(functions,"getExamFee");
//      console.log("getLicenseInfo() 호출");
      const result = await getFee({jmcd:jmcd}); //jmcd를 매개변수로 해서 자격증 호출함.
      const jsonResult = result.data.dataText; // JSON형태임. 
      const jsonData = JSON.parse(jsonResult);//JSON에서 자바스크립트 객체로 파싱.
      //이제 

      //items가 배열이 아니면 배열로 만드는 처리. 
      const items = jsonData.response?.body?.items?.item;
      const normalizedItems = Array.isArray(items) ? items : [items];

      const fee = normalizedItems.map(item =>({
        /**시험응시료*/
        contents: item.contents ? String(item.contents): " ",
        /**응시수수료 */
        infogb: item.infogb ? String(item.infogb): " ",
        /**자격증이름  */
        licenseName: item.jmfldnm ? String(item.jmfldnm): " ",
      }));
      feeList.push(fee);
      console.log("데이터", feeList);
      return feeList;
    }
  catch(error){
    const code = error.code;
    const message = error.message;
    const details = error.details;
    console.error("getLicenseFee/fireabase.js : "+error+code+message+details);
  }
}//getLicenseFee

/** 자격증 정보를 공공데이터 API에서 받아온다. */
async function getLicenseInfo(jmcd){
  const infoList = [];
  try{
    const functions =getFunctions(app,"us-central1");
    const getInfo = httpsCallable(functions,"getLicenseInfo");
//      console.log("getLicenseInfo() 호출");
      const result = await getInfo({jmcd:jmcd}); //jmcd를 매개변수로 해서 자격증 호출함.
      const jsonResult = result.data.dataText; // JSON형태임. 
      const jsonData = JSON.parse(jsonResult);//JSON에서 자바스크립트 객체로 파싱.
      //이제 

      //items가 배열이 아니면 배열로 만드는 처리. 
      const items = jsonData.response?.body?.items?.item;
      const normalizedItems = Array.isArray(items) ? items : [items];

      const info = normalizedItems.map(item =>({ //schedule -> 자격증 1개에 대한 정보. 
        /**글 내용*/
        contents: item.contents ? String(item.contents): " ",
        /**글 정보종류 */
        contentsName: item.infogb ? String(item.infogb): " ",
        /**자격증 이름 */
        licenseName: item.jmfldnm ? String(item.jmfldnm): " ",
        /**직무 분야 */
        obligfldnm: item.obligfldnm ? String(item.obligfldnm): " ",

      }));
      infoList.push(info);
      console.log("데이터", infoList);
      return infoList;
    }
  catch(error){
    const code = error.code;
    const message = error.message;
    const details = error.details;
    console.error("getLicenseList/fireabase.js : "+error+code+message+details);
  }
}//getLicenseInfo




async function getExamFeeList(){//자격증 시험 응시료를 가져옴. .jmcd 값을 인자로 넘겨주고
  const user = auth.currentUser;
  let feeList = [];
  if(user){//로그인 상태 
    //console.log("firebase.js/getExamFeeList()-> 사용자로그인상태");
    const userRef = doc(db,"user",user.uid); 
    const docSnap = await getDoc(userRef);
    if(docSnap.exists()){//해당하는 유저의 정보가 DB에 있을 떄 
      const jmcds = docSnap.data().jmcds;
      for(let i=0; i<jmcds.length; i++){ 
        if(jmcds[i]=="empty"){//empty는 회원이 관심있는 자격증이 없는 경우므로 함수를 시행하지 않음. 
        }
        else{
          try{
            const functions =getFunctions(app,"us-central1");
            const getExamFee = httpsCallable(functions,"getExamFee");
              console.log("getExamFee() 호출");
              const result = await getExamFee({jmcd:jmcds[i]});
              const jsonResult = result.data.dataText; // JSON형태임. 
              const jsonData = JSON.parse(jsonResult);//JSON에서 자바스크립트 객체로 파싱.

              const items = jsonData.response?.body?.items?.item;
              const normalizedItems = Array.isArray(items) ? items : [items];
            //  console.log(jsonData);
              if(!jsonData.response?.body?.items?.item){
                //return []; //빈 배열 리턴 
              }
              else{
                const fee = normalizedItems.map(item =>({ //schedule -> 자격증 1개에 대한 정보. 
                  /**시험응시료*/
                  contents: item.contents ? String(item.contents): " ",
                  /**응시수수료 */
                  infogb: item.infogb ? String(item.infogb): " ",
                  /**자격증이름  */
                  licenseName: item.jmfldnm ? String(item.jmfldnm): " ",
                }));
                feeList.push(fee);
              }                  
          }//try
          catch(error){
            const code = error.code;
            const message = error.message;
            const details = error.details;
            console.error("getLicenseList/fireabase.js : "+error+code+message+details);
          } 
        }
      }//for
      console.log(feeList);
      return feeList;
    }//if
    else{ //DB에 정보 없을 때 
      console.log("DB에 유저 정보가 없습니다! 운영팀에 문의주세요");
    }//else
  }//if user End 
  else{//사용자 로그인 안한 상태 
    console.log("사용자가 로그아웃 상태입니다. 로그인 해주세요");
  }//else user End 
 
 
}//end getExamFeeList



async function getLicenseInfoList(){//자격증정보들을 가져옴, 그냥 가져오는게 아니라 jmcd 값을 인자로 넘겨주고, 그걸로 하기. 
  const user = auth.currentUser;
  let feeList = [];
  if(user){//로그인 상태 
    //console.log("firebase.js/getExamFeeList()-> 사용자로그인상태");
    const userRef = doc(db,"user",user.uid); 
    const docSnap = await getDoc(userRef);
    if(docSnap.exists()){//해당하는 유저의 정보가 DB에 있을 떄 
      const jmcds = docSnap.data().jmcds;
      for(let i=0; i<jmcds.length; i++){ 
        if(jmcds[i]=="empty"){//empty는 회원이 관심있는 자격증이 없는 경우므로 함수를 시행하지 않음. 
        }
        else{
          try{
            const functions =getFunctions(app,"us-central1");
            const getLicenseInfo = httpsCallable(functions,"getLicenseInfo");
              console.log("getLicenseInfo() 호출");
              const result = await getLicenseInfo({jmcd:jmcds[i]});
              const jsonResult = result.data.dataText; // JSON형태임. 
              const jsonData = JSON.parse(jsonResult);//JSON에서 자바스크립트 객체로 파싱.
              console.log("firebase.js -> getLicenseInfo() -> jsonData ", jsonData);          
                  
          }
          catch(error){
            const code = error.code;
            const message = error.message;
            const details = error.details;
            console.error("getLicenseInfo()/fireabase.js : "+error+code+message+details);
            
          }
        }
      }//for 
    }//if doc snap 
  }//if user 
  
  
}//end getExamFeeList
//--------------------------------------------------------------------------자격증 관련(종료)------------------------------------------------------------------------------





//인증 객체 바깥에서도 사용 가능하게 export
export {auth,signUp,signIn,getUserName,getLicenseList,fetchLicenseList,getExamScheduleList,getLicenseInfoList,getExamFeeList, boardSave,saveMajorToFireStore,
  fetchMajorList,getLicenseInfo,searchLicenseInfo,signInEduNavi,storage,FileUpload,DisplayImage};