import React, { useState, useEffect } from 'react';
import '../assets/styles/TimerRunning.css';
import StopwatchModal from '../components/StopwatchModal.js';
import timerBg from '../assets/img/timerBtn.svg';

function TimerRunning() {
    const [isActive, setIsActive] = useState(true);  // 시작할 때 스톱워치가 자동으로 작동하도록 true로 설정
    const [isPaused, setIsPaused] = useState(false); // 시작할 때 일시정지가 아니도록 false로 설정
    const [time, setTime] = useState(0);

    useEffect(() => {
        let interval = null;

        // isActive가 true이고, isPaused가 false이면 타이머 작동
        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, isPaused]);

    const handleStart = () => {
        setIsActive(true);   // 시작 버튼을 누르면 타이머 활성화
        setIsPaused(false);  // 일시정지 해제
    };

    const handlePause = () => {
        setIsPaused(true);  // 정지 버튼을 누르면 타이머 일시정지
    };

    const handleEnd = () => {
        setIsActive(false);  // 타이머 비활성화
        setTime(0);          // 시간 초기화
    };

    return (
        <div className='runningTimer'>
            <div className='runningTimer-container'>
                <h2><span className='userName'>김멋사 개발자</span> 님의<br />건강한 개발을 응원합니다.</h2>
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
