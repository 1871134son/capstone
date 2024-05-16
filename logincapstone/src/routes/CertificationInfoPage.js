import React from 'react';
import './CertificationInfoPage.css'; // Make sure to create this CSS file

function CertificationInfoPage() {
  return (
    <div className="certification-page">
      <header>
        <img src="채용정보_국가기술자격증_본문_01__v1.jpg" alt="Header" />
      </header>
      <div className="content">
        <aside>
          <ul>
            <li><a href="#portfolio">공과대학</a></li>
            <li><a href="#ios">자연과학대학</a></li>
            <li><a href="#android">의학대학</a></li>
            <li><a href="#backend">사회과학대학</a></li>
            <li><a href="#data-analysis">인문대학</a></li>
            <li><a href="#ai">예체능대학</a></li>
            <li><a href="#game">농업대학</a></li>
          </ul>
        </aside>
        <main>
          {/* This will be empty as per your request to exclude the middle part */}
        </main>
      </div>
    </div>
  );
}

export default CertificationInfoPage;
