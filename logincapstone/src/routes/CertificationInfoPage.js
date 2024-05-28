import React, { useEffect, useState } from 'react';
import './CertificationInfoPage.css'; // Ensure the CSS file path is correct

function CertificationInfoPage() {
  const [sidebarTop, setSidebarTop] = useState(20);
  const [selectedCollege, setSelectedCollege] = useState('engineering');
  const [selectedCert, setSelectedCert] = useState(null); // 선택된 자격증의 ID를 관리하는 상태
  const certificationsData = {
    engineering: [
      {
        id: 1,
        title: "전문 프로그래머 자격증",
        category: "컴퓨터",
        price: "100,000원",
        description: "최신 컴퓨터 프로그래밍 기술을 배울 수 있는 과정"
      }
    ],
    "natural-sciences": [
      {
        id: 2,
        title: "데이터 분석 전문가",
        category: "데이터 과학",
        price: "150,000원",
        description: "데이터 분석 및 빅 데이터 처리 기술을 배울 수 있는 과정"
      }
    ],
    medicine: [
      {
        id: 3,
        title: "AI 개발자 자격증",
        category: "인공지능",
        price: "200,000원",
        description: "인공지능 개발에 필요한 실무 지식을 배울 수 있는 과정"
      }
    ],
    "social-sciences": [
      {
        id: 4,
        title: "사회과학 전문가",
        category: "사회과학",
        price: "120,000원",
        description: "사회과학 이론과 실제를 배울 수 있는 과정"
      }
    ],
    humanities: [
      {
        id: 5,
        title: "인문학 연구원",
        category: "인문학",
        price: "130,000원",
        description: "인문학 분야의 깊은 지식을 배울 수 있는 과정"
      }
    ],
    arts: [
      {
        id: 6,
        title: "예술가 자격증",
        category: "예술",
        price: "140,000원",
        description: "예술 창작과 실습을 배울 수 있는 과정"
      }
    ],
    agriculture: [
      {
        id: 7,
        title: "농업 전문가",
        category: "농업",
        price: "110,000원",
        description: "현대 농업 기술과 경영을 배울 수 있는 과정"
      }
    ]
  };


useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setSidebarTop(Math.max(20, scrollTop + 20));
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// 상세 정보 닫기 함수
const handleCloseDetail = () => {
  setSelectedCert(null); // 선택된 자격증 상태를 null로 설정하여 상세 정보를 닫음
};

return (
  <div className="certification-page">
    <header>
      <img src="header-image.jpg" alt="Header" />
    </header>
    <div className="content">
      <aside style={{ top: `${sidebarTop}px` }}>
        <ul>
            <li><a href="#engineering" onClick={() => setSelectedCollege('engineering')}>공과대학</a></li>
            <li><a href="#natural-sciences" onClick={() => setSelectedCollege('natural-sciences')}>자연과학대학</a></li>
            <li><a href="#medicine" onClick={() => setSelectedCollege('medicine')}>의학대학</a></li>
            <li><a href="#social-sciences" onClick={() => setSelectedCollege('social-sciences')}>사회과학대학</a></li>
            <li><a href="#humanities" onClick={() => setSelectedCollege('humanities')}>인문대학</a></li>
            <li><a href="#arts" onClick={() => setSelectedCollege('arts')}>예체능대학</a></li>
            <li><a href="#agriculture" onClick={() => setSelectedCollege('agriculture')}>농업대학</a></li>
        </ul>
      </aside>
      <main>
        <div className="certification-cards">
          {certificationsData[selectedCollege].map(cert => (
            <div className="card" key={cert.id}>
              <h3>{cert.title}</h3>
              <p>{cert.category}</p>
              <p>{cert.price}</p>
              <p>{cert.description}</p>
              {/* 상세 정보 버튼 */}
              <button onClick={() => setSelectedCert(selectedCert === cert.id ? null : cert.id)}>
                {selectedCert === cert.id ? '상세 정보 닫기' : '상세 정보 보기'}
              </button>
              {/* 선택된 자격증의 ID와 현재 자격증의 ID가 일치하면 상세 정보를 표시 */}
              {selectedCert === cert.id && (
                <div className="detail-info">
                  <h4>상세 정보</h4>
                  {/* 여기에 상세 정보 내용을 표시 */}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  </div>
);
}
export default CertificationInfoPage;
