// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import TimerSetup from './pages/TimerSetup';
import TimerRunning from './pages/TimerRunning';
import Challenge from './pages/Challenge';
import Stretching from './pages/Stretching';
import Mypage from './pages/Mypage';
import DoneChallenge from './pages/DoneChallenge';
import ChallengeDetail from './pages/ChallengeDetail';
import KakaoAuth from './components/KakaoAuth';
import AdditionalInfo from './pages/AdditionalInfo';
import './assets/styles/App.css'; 

/*import { messaging } from './firebase-config';

function requestPermission() {
  console.log('알림 권한 요청 중...');

  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('알림 권한이 허용되었습니다.');
      messaging.getToken()
        .then((token) => {
          console.log(`푸시 토큰 발급 완료 : ${token}`);
          saveTokenToLocalStorage(token);
        })
        .catch((err) => {
          console.log('푸시 토큰 가져오는 중에 에러 발생', err);
        });

      messaging.onTokenRefresh(() => {
        messaging.getToken({ vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY })
          .then((newToken) => {
            console.log(`새로운 푸시 토큰 발급 완료 : ${newToken}`);
            saveTokenToLocalStorage(newToken);
          })
          .catch((err) => {
            console.log('토큰 갱신 중에 에러 발생', err);
          });
      });
    } else if (permission === 'denied') {
      console.log('알림 권한이 거부되었습니다.');
    }
  });
}
function saveTokenToLocalStorage(token) {
  // FCM 토큰을 로컬 스토리지에 저장
  localStorage.setItem('fcmToken', token);
  console.log('FCM 토큰이 로컬 스토리지에 저장되었습니다.');
}
/*function sendTokenToServer(token) {
  fetch('/api/save-fcm-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  })
  .then(response => response.json())
  .then(data => console.log('토큰이 서버에 저장되었습니다.', data))
  .catch(error => console.error('서버에 토큰 저장 중 에러 발생', error));
}*/

  function App() {
  /*useEffect(() => {
    console.log('Firebase Messaging 객체:', messaging);
    requestPermission();
  }, []);*/

  return (
    <Router>
      <div className="page-container">
        <NavBar />
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/timer" element={<TimerSetup />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/stretching" element={<Stretching />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/timer-running" element={<TimerRunning />} />
            <Route path="/done-challenge" element={<DoneChallenge />} />
            <Route path="/challenge-detail" element={<ChallengeDetail />} />
            <Route path="/api/v1/users/login/kakao" element={<KakaoAuth />} />
            <Route path="/additional-info" element={<AdditionalInfo />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;




