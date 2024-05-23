import React, { useEffect, useState } from 'react';
import './CertificationInfoPage.css'; // CSS 파일 경로 확인

function CertificationInfoPage() {
  const [sidebarTop, setSidebarTop] = useState(20);
  const [certifications, setCertifications] = useState([
    {
      id: 1,
      title: "전문 프로그래머 자격증",
      category: "컴퓨터",
      price: "100,000원",
      description: "최신 컴퓨터 프로그래밍 기술을 배울 수 있는 과정"
    },
    {
      id: 2,
      title: "데이터 분석 전문가",
      category: "데이터 과학",
      price: "150,000원",
      description: "데이터 분석 및 빅 데이터 처리 기술을 배울 수 있는 과정"
    },
    {
      id: 3,
      title: "AI 개발자 자격증",
      category: "인공지능",
      price: "200,000원",
      description: "인공지능 개발에 필요한 실무 지식을 배울 수 있는 과정"
    }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setSidebarTop(Math.max(20, scrollTop + 20)); // 스크롤에 따라 사이드바의 위치를 조정합니다
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="certification-page">
      <header>
        <img src="header-image.jpg" alt="Header" />
      </header>
      <div className="content">
        <aside style={{ top: `${sidebarTop}px` }}>
          <ul>
            <li><a href="#engineering">공과대학</a></li>
            <li><a href="#natural-sciences">자연과학대학</a></li>
            <li><a href="#medicine">의학대학</a></li>
            <li><a href="#social-sciences">사회과학대학</a></li>
            <li><a href="#humanities">인문대학</a></li>
            <li><a href="#arts">예체능대학</a></li>
            <li><a href="#agriculture">농업대학</a></li>
          </ul>
        </aside>
        <main>
          <div className="certification-cards">
            {certifications.map(cert => (
              <div className="card" key={cert.id}>
                <h3>{cert.title}</h3>
                <p>{cert.category}</p>
                <p>{cert.price}</p>
                <p>{cert.description}</p>
                <button>상세정보</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default CertificationInfoPage;
