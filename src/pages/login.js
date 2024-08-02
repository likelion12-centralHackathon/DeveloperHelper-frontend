import React from 'react';
import '../assets/styles/Login.css';

// 이미지 파일 import
import kakaoIcon from '../assets/img/kakao_icon.svg';
import googleIcon from '../assets/img/google_icon.svg';
import mainIcon from '../assets/img/main_icon.svg';

function Login() {
  const handleKakaoLogin = () => {
    console.log('카카오 로그인');
  };

  const handleGoogleLogin = () => {
    console.log('구글 로그인');
  };

  return (
    <div className="login-page">
    <div className="login-container">
    <div className="logo-setting">
          <p className="logoName">
            개발자챙김이<span className="span">로</span>
          </p>
          <img className="mainIcon-logo" src={mainIcon} alt="Main Icon" />
        </div>
        <p className="ment">건강챙길 준비되셨나요?</p>
      <button className="kakao-login-button" onClick={handleKakaoLogin}>
        <img src={kakaoIcon} alt="카카오" /> 카카오 로그인
      </button>
      <button className="google-login-button" onClick={handleGoogleLogin}>
        <img src={googleIcon} alt="구글" /> 구글 로그인
      </button>
    </div>
    </div>
  );
}

export default Login;