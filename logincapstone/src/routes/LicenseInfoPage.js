import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function LicenseInfoPage(){
    const {id} = useParams(); //URL 파라미터에서 id를 가져온다. 
    const [licenseInfo,setLicenseInfo] = useState(null); //자격증 정보 

    return (
        <div>
          {licenseInfo ? (
            <div>
              <h1>{licenseInfo.name}</h1>
              <p>{licenseInfo.description}</p>
              <p>응시료: {licenseInfo.fee}</p>
              {/* 필요한 다른 정보들 */}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      );
}


export default LicenseInfoPage;
