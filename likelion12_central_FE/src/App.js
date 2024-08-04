import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TimerSetup from './pages/TimerSetup';
import TimerRunning from './pages/TimerRunning';
import Challenge from './pages/Challenge';
import Stretching from './pages/Stretching';
import Mypage from './pages/Mypage';
import DoneChallenge from './pages/DoneChallenge';
import ChallengeDetail from './pages/ChallengeDetail';
import KakaoAuth from './components/KakaoAuth';
import './assets/styles/App.css'; 
import AdditionalInfo from './pages/AdditionalInfo';

function App() {
  return (
    <Router>
      <div className="page-container">
        <NavBar />
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/timer" element={<TimerSetup />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/stretching" element={<Stretching />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/timer-running" element={<TimerRunning />} />
            <Route path="/done-challenge" element={<DoneChallenge />} />
            <Route path="/challenge-detail" element={<ChallengeDetail />} />
            {/* 카카오 인증 처리 경로 */}
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



