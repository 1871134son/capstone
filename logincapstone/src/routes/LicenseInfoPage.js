import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

/** 원 단위로 포멧팅 해주는 함수 */
function formatCurrency(value) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0 // 소수점 이하 자리수 설정 (없음)
    }).format(value).replace('₩', '').trim() + '원';
  }

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
        if(licenseInfo.infoData){ //데이터가 로드 되었을 때만 실행함. 
           try{
            const feeData = licenseInfo.feeData[0][0]?.contents || '';
            if (feeData) { //,단위로 나누고 다시 원 단위로 변경 후 결합 
                // 응시료 문자열 포맷팅
                const formattedFee = feeData.split(', ').map(fee => {
                  const [exam, amount] = fee.split(': ');
                  return `${exam.trim()} : ${formatCurrency(amount.trim().replace(/,/g, ''))}`;
                }).join(', ');
                setFee(formattedFee); // 자격증 응시료 state
              } 
            else{
                setFee("응시료 정보가 없습니다. 자세한 사항은 Q-net 을 참조해주세요.");
            }
            setInfoData(licenseInfo.infoData);
            setLicenseName(licenseInfo.licenseName);
            setLicenseCategory(licenseInfo.infoData[0][0].obligfldnm); //자격증 분야 설정 
           }
           catch(err){
            setError("정보 요청이 지원되지 않는 자격증입니다");
            console.error("Error in useEffect: ", err);
           }
        }
        else{
            alert("해당 자격증은 추후 업데이트 예정입니다.");
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
