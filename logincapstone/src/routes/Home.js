import { getUserName,auth,getLicenseList,getExamScheduleList, getExamFeeList, getLicenseInfoList,saveMajorToFireStore } from "../firebase/firebase";
import { useState,useEffect } from 'react';
import { getAuth,onAuthStateChanged  } from "firebase/auth"; //인증 기능 
import axios from "axios";
import { getFunctions, httpsCallable } from "firebase/functions";
import {SearchLicenseComponent, UserNameComponent} from "../testStuff/stuff.js"


function HomePage(){
   

    return(
        <>
        </>
    )
}// 


  

export default HomePage;