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
import {SearchLicenseComponent, UserNameComponent, NotificationBell} from "../testStuff/stuff.js";

function MyPage(){

    return(
        <>
                    <NotificationBell></NotificationBell>
            <UserNameComponent></UserNameComponent>
        </>
    )
}

function TestImageUpload(){
  return(
      <>
          <Container>
             <FileUpload folderName ="borad" fileName="forTest"></FileUpload>
             <DisplayImage folderName ="borad" fileName="forTest"></DisplayImage>
          </Container>
      </>
  );
}


  
export default MyPage;