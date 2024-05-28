import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Spinner, Card, Container, Row, Col } from 'react-bootstrap';
import './LicenseInfoPage.css'; // LicenseInfoPage에 대한 CSS 파일 import

/** 원 단위로 포멧팅 해주는 함수 */
function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0 // 소수점 이하 자리수 설정 (없음)
  }).format(value).replace('₩', '').trim() + '원';
}

function LicenseInfoPage(props) {
  const { id } = useParams(); //URL 파라미터에서 id를 가져온다. 
  const location = useLocation();
  const { licenseInfo } = location.state || {};

  const [fee, setFee] = useState('');
  const [infoData, setInfoData] = useState([]);
  const [licenseName, setLicenseName] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('');
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("LicenseInfoPage UseEffect");
    if (licenseInfo.infoData) { //데이터가 로드 되었을 때만 실행함. 
      try {
        const feeData = licenseInfo.feeData[0][0]?.contents || '';
        if (feeData) { //,단위로 나누고 다시 원 단위로 변경 후 결합 
          // 응시료 문자열 포맷팅
          const formattedFee = feeData.split(', ').map(fee => {
            const [exam, amount] = fee.split(': ');
            return `${exam.trim()} : ${formatCurrency(amount.trim().replace(/,/g, ''))}`;
          }).join(', ');
          setFee(formattedFee); // 자격증 응시료 state
        } else {
          setFee("응시료 정보가 없습니다. 자세한 사항은 Q-net 을 참조해주세요.");
        }
        setInfoData(licenseInfo.infoData);
        setLicenseName(licenseInfo.licenseName);
        setLicenseCategory(licenseInfo.infoData[0][0].obligfldnm); //자격증 분야 설정 
        setLoading(false); // 데이터 로딩 완료
      } catch (err) {
        setError("정보 요청이 지원되지 않는 자격증입니다");
        console.error("Error in useEffect: ", err);
        setLoading(false); // 데이터 로딩 오류
      }
    } else {
      alert("해당 자격증은 추후 업데이트 예정입니다.");
      setError("검색오류");
      setLoading(false); // 데이터 로딩 오류
    }
  }, [licenseInfo]);

  return (

    <Container> {/* 클래스 이름 추가 */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <p>{error}</p> // 오류 발생 시 표시
      ) : (
        <LicenseInfo
          licenseName={licenseName}
          infoData={infoData}
          fee={fee}
          licenseCategory={licenseCategory}
        />
      )}
    </Container>
  );
}

/**받아온 데이터를 전시해주는 컴포넌트  */
function LicenseInfo({ licenseName, infoData, fee, licenseCategory }) {  //infoData의 수는 동적으로 존재해서, map사용
  return (
    <div style={{ background: "#FFF5EE" }}>
      <hr></hr>
      <Card.Header className="text-center" >
        <h2 className="LicenseInfoPage-title">{licenseName}</h2> {/* 클래스 이름 추가 */}
        <h4 className="LicenseInfoPage-category">직무 분야: {licenseCategory}</h4> {/* 클래스 이름 추가 */}
      </Card.Header>
      <Card.Body>
        <Container>
          {infoData[0].map((data, index) => (
            <Row key={index} className="LicenseInfoPage-content mb-3"> {/* 클래스 이름 추가 */}
              <Col md={3} className="LicenseInfoPage-content-title">
                {data.contentsName}
              </Col>
              <Col md={9} className="LicenseInfoPage-content-text">
                {data.contents}
              </Col>
            </Row>
          ))}
          <Row className="LicenseInfoPage-fee">
            <Col>
              <h4>시험 응시료: {fee}</h4>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </div>
  );
}

export default LicenseInfoPage;