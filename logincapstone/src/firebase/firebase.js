// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword   } from "firebase/auth"; //인증 기능 
import {getFirestore,doc, setDoc,getDoc, collection, addDoc,getDocs} from "firebase/firestore"; //firebase cloud firestore 기능 
import { getFunctions, httpsCallable } from "firebase/functions";
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
  

async function signUp(email,password,userName,licenses){
    try{
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;

      /* DB 콜렉션에 유저 정보들 저장, uid로 document 생성 */
      await setDoc(doc(db,"user",user.uid),{
        userName: userName,
        license0: licenses[0],
        license1: licenses[1],
        license2: licenses[2],
        email : email,
      });

      console.log('User created successfully with email:', user.email);
      alert("회원가입을 축하드립니다!");
    } catch (error) {
      console.error('Error creating user:', error);
      // 에러 처리 로직을 여기에 작성합니다.
    }//catch 
  }//Sign Up end 


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
             saveLicenseToFireStore(licneseNameValue);
            })
    }
    catch(error){
      const code = error.code;
      const message = error.message;
      const details = error.details;
      console.error("getLicenseList/fireabase.js : "+error+code+message+details);
      
    }
}//end getLicenseList()

async function saveLicenseToFireStore(licenseList){ //자격증 리스트를 Firebase DB에 저장합니다. 
  const licenseCollection = collection(db,"license"); //license collection reference
  for(const license of licenseList){//licenseList 배열 만큼 반복
      try{
        const docRef = await addDoc(licenseCollection,{
          name: license
        });
        console.log("Document written with ID: ", docRef.id);
      }catch(error){
        console.error("Error adding document LicenseList: ",error);
      }
  }
}//saveLicenseToFireStore END

async function fetchLicenseList(){
  const licenseList =[];
  try{
    const querySnapShot = await getDocs(collection(db,"license"));
    querySnapShot.forEach((doc) => {
      let docData = doc.data();//문서의 데이터 객체 가져옴.
      licenseList.push(docData.name);
    });
    console.log("fetchLicenseList 성공!:", licenseList);
  }catch(error){
    console.error("fetchLicenseList 에러: ",error);
  }
  return licenseList;//배열을 반환한다. 
}


//인증 객체 바깥에서도 사용 가능하게 export
export {auth,signUp,signIn,getUserName,getLicenseList,fetchLicenseList};