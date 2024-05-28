import React, { useEffect, useState } from 'react';
import './CertificationInfoPage.css'; // Ensure the CSS file path is correct
import certificationsData from './licenseData.js';


function CertificationInfoPage() {
  const [sidebarTop, setSidebarTop] = useState(20);
  const [selectedCollege, setSelectedCollege] = useState('engineering');
  const [selectedCert, setSelectedCert] = useState(null); // 선택된 자격증의 ID를 관리하는 상태
 

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
    <div className="content">
    <hr></hr>

      <aside style={{ top: `${sidebarTop}px` }}>
        <ul>
            <li><a href="#engineering" onClick={() => setSelectedCollege('engineering')}>공과대학</a></li>
            <li><a href="#natural_sciences" onClick={() => setSelectedCollege('natural_sciences')}>자연과학대학</a></li>
            <li><a href="#medicine" onClick={() => setSelectedCollege('medicine')}>의학대학</a></li>
            <li><a href="#social_sciences" onClick={() => setSelectedCollege('social_sciences')}>사회과학대학</a></li>
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
                    {cert.detail}
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
