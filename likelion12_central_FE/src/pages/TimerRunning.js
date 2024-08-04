import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/TimerRunning.css';
import StopwatchModal from '../components/StopwatchModal.js';
import timerBg from '../assets/img/timerBtn.svg';

function TimerRunning() {
    const [isActive, setIsActive] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [time, setTime] = useState(0);
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let interval = null;

        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, isPaused]);

    useEffect(() => {
        const fetchNickname = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const userId = localStorage.getItem('userId');
                console.log('Access Token:', accessToken);
                console.log('User ID:', userId);

                const response = await axios.get(`http://localhost:8080/api/v1/users/info/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log('Response:', response.data);
                setNickname(response.data.data.nickname);
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        const refreshResponse = await axios.post('http://localhost:8080/api/v1/users/refresh', {}, {
                            headers: {
                                'Authorization': `Bearer ${refreshToken}`
                            }
                        });
                        const newAccessToken = refreshResponse.data.data;
                        localStorage.setItem('accessToken', newAccessToken);
                        const userId = localStorage.getItem('userId');
                        const retryResponse = await axios.get(`http://localhost:8080/api/v1/users/info/${userId}`, {
                            headers: {
                                'Authorization': `Bearer ${newAccessToken}`
                            }
                        });
                        console.log('Retry Response:', retryResponse.data);
                        setNickname(retryResponse.data.data.nickname);
                    } catch (refreshError) {
                        console.error('리프레시 토큰 갱신 실패:', refreshError);
                        alert('로그인이 필요합니다.');
                        navigate('/login');
                    }
                } else {
                    console.error('사용자 정보를 불러오는 데 실패했습니다:', error);
                }
            }
        };

        fetchNickname();
    }, [navigate]);

    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleEnd = () => {
        setIsActive(false);
        setTime(0);
    };

    return (
        <div className='runningTimer'>
            <div className='runningTimer-container'>
                <h2><span className='userName'>{nickname}</span> 님의<br />건강한 개발을 응원합니다.</h2>
                <p><span className="timeInterval">1시간 30분</span>마다 설정한 신체부위별 스트레칭 시작!</p>
                <div className='stopwatch-container'>
                    <img src={timerBg} alt='timer bg'></img>
                    <div>
                        <div className='stopwatch'>
                            <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                            <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                            <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
                        </div>
                        <div className="stopwatchBtn-container">
                            <button className='endBtn' onClick={handleEnd}><div className="endBtn-design">종료</div></button>
                            <div className='connecting'>···</div>
                            {isPaused ? (
                                <button className='startBtn' onClick={handleStart}><div className="startBtn-design">시작</div></button>
                            ) : (
                                <button className='stopBtn' onClick={handlePause}><div className="stopBtn-design">정지</div></button>
                            )}
                        </div>
                    </div>
                    
                </div>
                <div className='bodyPartHistory-container'>
                    <div className='bodyPartHistory'>
                        <div className='historyNum'>1</div>
                        <div className='historyPart'>눈,허리</div>
                    </div>
                    <div className='dot'>·<br/>·</div>
                    <div className='bodyPartHistory'>
                        <div className='historyNum'>2</div>
                        <div className='historyPart'>눈,허리,기타</div>
                    </div>
                </div>
            </div>
            <StopwatchModal/>
        </div>
    );
}

export default TimerRunning;





