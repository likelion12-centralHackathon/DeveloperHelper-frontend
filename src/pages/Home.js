import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Home.css';
import mainIcon from '../assets/img/main_icon.svg';
import vectorArrow from '../assets/img/vector.svg';
import timerSample from '../assets/img/timer_sample.svg';
import stretchingSample from '../assets/img/stretching_sample.svg';
import challengeSample from '../assets/img/challenge_sample.svg';
import vectorArrow2 from '../assets/img/Vector_white.svg';
import healthIcon from '../assets/img/challengeIcon/health3.svg';
import developeIcon from '../assets/img/challengeIcon/develope5.svg';
import freeIcon from '../assets/img/challengeIcon/free1.svg';

function Home() {
    const navigate = useNavigate();

    const handleTimerClick  = () => {
        navigate('/timer');
    };
    const handleTodayChallengeClick = () => {
        navigate('/challenge');
    };
    return (
        <div className='home'>
            <div className='home-container'>
                <div className='home-header'>
                    <div className='home-header-content'>
                        <p>개발자챙김이</p>
                        <h2>타이머와 함께<br/>건강한 개발을 시작해봐요!</h2>
                    </div>
                    <img className='home-mainIcon' src={mainIcon} alt='main icon'></img>
                </div>
                <div className='today-challenge'>
                    <div className='today-challenge-ment' onClick={handleTodayChallengeClick}>
                        <p>오늘의 챌린지</p>
                        <img src={vectorArrow} alt='vector'></img>
                    </div>
                    <div className='today-challenge-container'>
                        <div className='today-challenge-content'>
                            <div className='today-challenge-icon-container'>
                                <div className='today-challenge-icon'>
                                <img src={healthIcon} alt='icon'></img>
                                </div>
                            </div>
                            <div className='today-challenge-name'>
                               3개의 신체 부위 운동하기
                            </div>
                        </div>
                        <div className='today-challenge-content'>
                            <div className='today-challenge-icon-container'>
                                <div className='today-challenge-icon'>
                                <img src={developeIcon} alt='icon'></img>
                                </div>
                            </div>
                            <div className='today-challenge-name'>
                               8시간 미만으로 개발 끝내기
                            </div>
                        </div>
                        <div className='today-challenge-content'>
                            <div className='today-challenge-icon-container'>
                                <div className='today-challenge-icon'>
                                <img src={freeIcon} alt='icon'></img>
                                </div>
                            </div>
                            <div className='today-challenge-name'>
                               '구글 엔지니어는 이렇게 일한다' 독서하기
                            </div>
                        </div>
                    </div>
                </div>
                <div className='timer-container'>
                    <div className='timer-sample'>
                       <img className='timer-sample-img' src={timerSample} alt='timer sample'></img> 
                    </div>
                    <div className='timer-ment'>
                        <p className="timer-main-ment">개발자들을 위한 건강한 타이머</p>
                        <p className="timer-sub-ment">스트레칭 타이머 설정을 통해<br/>
                        건강한 개발을 시작!</p>
                        <button className='timer-button' onClick={handleTimerClick}>건강한 개발 시작하기 <img src={vectorArrow2} alt="vector"></img></button>
                    </div>
                </div>
                <div className='additional-container'>
                    <div className='additional-sample'>
                       <img className='challenge-sample-img' src={challengeSample} alt='challenge sample'></img> 
                       <img className='stretching-sample-img' src={stretchingSample} alt='stretching sample'></img> 
                    </div>
                    <div className='additional-ment'>
                        <p className='additional-main-ment'>건강한 개발을 챌린지와<br/>
                        스트레칭으로</p>
                        <p className='additional-sub-ment'>챌린지와 스트레칭을 통해<br/>
                        건강한 개발자 되기!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;