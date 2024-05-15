import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

function LicenseInfoPage(props){
    const {id} = useParams(); //URL 파라미터에서 id를 가져온다. 
    const location = useLocation();
    const {licenseInfo} = location.state || {};

    const [fee, setFee] = useState('');
    const [infoData, setInfoData] = useState([]);
    const [licenseName, setLicenseName] = useState('');
    const [licenseCategory, setLicenseCategory] = useState('');
    const [error, setError] = useState(null);


    useEffect(()=>{
        if(licenseInfo){ //데이터가 로드 되었을 때만 실행함. 
           try{
            setFee(licenseInfo.feeData[0][0].contents);
            setInfoData(licenseInfo.infoData);
            setLicenseName(licenseInfo.licenseName);
            setLicenseCategory(licenseInfo.infoData[0][0].obligfldnm);
           }
           catch(err){
            setError("정보 요청이 지원되지 않는 자격증입니다");
            console.error("Error in useEffect: ", err);
           }
        }
        else{
            setError("검색오류");
        } 
        
    },[licenseInfo]);

    return (
        <LicenseInfo 
         licenseName = {licenseName}
         infoData ={infoData}
         fee = {fee}
         licenseCategory = {licenseCategory}
        ></LicenseInfo>
      );
}
/**받아온 데이터를 전시해주는 컴포넌트  */
function LicenseInfo({licenseName,infoData,fee,licenseCategory}){  //infoData의 수는 동적으로 존재해서, map사용
    return(
    
        <div>
          {licenseName ? ( //아직 로딩 중이면 Loading 표시 
            <div>
              <h2>{licenseName}</h2>
              <h4>직무 분야: {licenseCategory}</h4>
                {infoData[0].map((data,index)=>(
                      <div key={index}>
                      <h4>{data.contentsName}</h4>
                      <p>{data.contents}</p>
                    </div>
                ))}
              
              <h4>시험 응시료: {fee}</h4>
              {/* 필요한 다른 정보들 */}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
    );
}

export default LicenseInfoPage;
