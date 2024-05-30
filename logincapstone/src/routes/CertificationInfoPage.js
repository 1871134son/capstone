import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './CertificationInfoPage.css'; // Ensure the CSS file path is correct
import certificationsData from './licenseData.js';

Modal.setAppElement('#root');

function CertificationInfoPage() {
  const [sidebarTop, setSidebarTop] = useState(20);
  const [selectedCollege, setSelectedCollege] = useState('engineering');
  const [selectedCert, setSelectedCert] = useState(null); // 선택된 자격증의 ID를 관리하는 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setSidebarTop(Math.max(20, scrollTop + 20));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = (cert) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCert(null);
  };

  return (
    <div className="certification-page">
      <div className="content">
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
          <div className="certification-style">
            {certificationsData[selectedCollege].map(cert => (
              <div className="styles" key={cert.id} onClick={() => openModal(cert)}>
                <h3>{cert.title}</h3>
                <p>{cert.category}</p>
                <p>{cert.price}</p>
                <p>{cert.description}</p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {selectedCert && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="상세정보"
          className="Modal"
          overlayClassName="Overlay"
        >
          <h4>{selectedCert.title} 상세정보</h4>
          <div className="detail-info">
            {selectedCert.detail}
          </div>
          <button onClick={closeModal}>닫기</button>
        </Modal>
      )}
    </div>
  );
}

export default CertificationInfoPage;
