import React, { useState, useEffect } from 'react';
import { signIn } from "../firebase/firebase.js";
import './SignIn.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

function SignInPage() {
  const [email, setEmail] = useState(''); // 이메일 상태를 저장할 useState 훅
  const [password, setPassword] = useState(''); // 비밀번호 상태를 저장할 useState 훅
  const navigate = useNavigate(); // React Router의 useNavigate 훅을 사용하여 페이지 이동 기능을 가져옴

  useEffect(() => {
    // 페이지가 로드될 때 실행되는 효과
    const signup = document.getElementById("sign-up");
    const signin = document.getElementById("sign-in");
    const loginin = document.getElementById("login-in");
    const loginup = document.getElementById("login-up");
  
    if (signup && signin && loginin && loginup) {
      signup.addEventListener("click", () => {
        // "가입" 버튼을 클릭할 때의 동작
        loginin.classList.remove("block");
        loginup.classList.remove("none");
  
        loginin.classList.add("none");
        loginup.classList.add("block");
      });
  
      signin.addEventListener("click", () => {
        // "로그인" 버튼을 클릭할 때의 동작
        loginin.classList.remove("none");
        loginup.classList.remove("block");
  
        loginin.classList.add("block");
        loginup.classList.add("none");
      });
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await signIn(email, password); // 이메일과 비밀번호로 로그인을 시도함
  };
  
  return (
    <div className="login">
      <div className="login__content">
        <div className="login__img">
          <img src="https://image.freepik.com/free-vector/code-typing-concept-illustration_114360-3581.jpg" alt="user login" />
        </div>
        <div className="login__forms">
          {/* 로그인 양식 */}
          <form onSubmit={handleSubmit} className="login__register" id="login-in">
            <h1 className="login__title">로그인</h1>
            <div className="login__box">
              <FontAwesomeIcon icon={faUser} className="login__icon" />
              <input type="text" placeholder="아이디" className="login__input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="login__box">
              <FontAwesomeIcon icon={faLock} className="login__icon" />
              <input type="password" placeholder="비밀번호" className="login__input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <a href="#" className="login__forgot">비밀번호를 잊으셨나요? </a>
            <button type="submit" className="login__button">로그인</button>
            <div>
              <span className="login__account login__account--account">계정이 없으신가요?</span>
              &nbsp;
              <span className="login__signin login__signin--signup" id="sign-up">가입하기</span>
            </div>
          </form>
          
          {/* 회원가입 양식 */}
          <form action="" className="login__create none" id="login-up">
            <h1 className="login__title">회원가입</h1>
            <div className="login__box">
              <FontAwesomeIcon icon={faUser} className="login__icon" />
              <input type="text" placeholder="아이디" className="login__input" />
            </div>
            <div className="login__box">
              <FontAwesomeIcon icon={faEnvelope} className="login__icon" />
              <input type="text" placeholder="이메일" className="login__input" />
            </div>
            <div className="login__box">
              <FontAwesomeIcon icon={faLock} className="login__icon" />
              <input type="password" placeholder="비밀번호" className="login__input" />
            </div>
            <button type="button" onClick={() => navigate('/second-form')} className="login__button">다음</button>
            <div>
              <span className="login__account login__account--account">이미 계정이 있으신가요?</span>
              &nbsp;
              <span className="login__signup login__signup--signup" id="sign-in">로그인</span>
            </div>
            <div className="login__social">
              <a href="#" className="login__social--icon"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#" className="login__social--icon"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" className="login__social--icon"><FontAwesomeIcon icon={faGoogle} /></a>
              <a href="#" className="login__social--icon"><FontAwesomeIcon icon={faGithub} /></a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;