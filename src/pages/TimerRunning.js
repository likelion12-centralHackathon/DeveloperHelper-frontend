import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/styles/TimerRunning.css';
import StopwatchModal from '../components/StopwatchModal.js';
import timerBg from '../assets/img/timerBtn.svg';

// 시간과 분으로 변환하는 함수
const formatCycleTime = (cycle) => {
    const hours = Math.floor(cycle);
    const minutes = Math.round((cycle - hours) * 60);
    
    if (minutes === 0) {
        return `${hours}시간`;
    }
    
    return `${hours}시간 ${minutes}분`;
};

// 본문 부위 배열
const bodyParts = [
    { value: '눈', label: '눈', id: 1 },
    { value: '목', label: '목', id: 2 },
    { value: '허리', label: '허리', id: 3 },
    { value: '다리', label: '다리', id: 4 },
    { value: '기타', label: '기타', id: 5 }
];

// 본문 부위 ID를 이름으로 변환하는 함수
const getBodyPartNames = (partIds) => {
    return partIds.map(id => {
        const part = bodyParts.find(bp => bp.id === id);
        return part ? part.value : '알 수 없음';
    }).join(', ');
};

function TimerRunning() {
    const [isActive, setIsActive] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [time, setTime] = useState(0);
    const [nickname, setNickname] = useState('');
    const [timerDetails, setTimerDetails] = useState(null); // 타이머 정보를 저장할 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
    const [currentPart, setCurrentPart] = useState(null); // 현재 스트레칭 부위 추가
    const navigate = useNavigate();
    const location = useLocation();
    const timerId = location.state?.timerId; // URL 상태에서 타이머 ID 가져오기

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

                const response = await axios.get(`https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/users/info/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setNickname(response.data.data.nickname);
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        const refreshResponse = await axios.post('https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/users/refresh', {}, {
                            headers: {
                                'Authorization': `Bearer ${refreshToken}`
                            }
                        });
                        const newAccessToken = refreshResponse.data.data;
                        localStorage.setItem('accessToken', newAccessToken);
                        const userId = localStorage.getItem('userId');
                        const retryResponse = await axios.get(`https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/users/info/${userId}`, {
                            headers: {
                                'Authorization': `Bearer ${newAccessToken}`
                            }
                        });
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

    useEffect(() => {
        const fetchTimerDetails = async () => {
            if (timerId) {
                try {
                    const accessToken = localStorage.getItem('accessToken');
                    const response = await axios.get(`https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/timer/${timerId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    setTimerDetails(response.data.data);
                } catch (error) {
                    console.error('타이머 정보를 불러오는 데 실패했습니다:', error);
                }
            }
        };

        fetchTimerDetails();
    }, [timerId]);

    // 타이머 상태를 업데이트하는 함수
const updateTimerState = async (timerId, timerState, partType = -1) => {
    const accessToken = localStorage.getItem('accessToken');
    const date = new Date().toISOString().split('T')[0]; // yyyy-MM-dd 형식

    try {
        const response = await axios.post(
            `https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/timer/state/${timerId}?date=${date}&timerState=${timerState}&part=${partType}`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        if (response.status >= 200 && response.status < 300) {
            console.log('API Response:', response.data);
            // 응답 데이터를 처리하는 로직 추가
            // 예를 들어, 상태에 따라 UI 업데이트
        } else {
            console.error('API Error:', response.status, response.data);
        }
    } catch (error) {
        console.error('Network Error:', error.message || error);
    }
};



// 스트레칭 시작
const handleStretchingStart = (partType) => {
    updateTimerState(timerId, 4, partType); // timerId와 4 (스트레칭 시작), partType 전달
};

// 스트레칭 종료
const handleStretchingEnd = () => {
    updateTimerState(timerId, 5); // timerId와 5 (스트레칭 종료) 전달
};
    //타이머 재시작
    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
        updateTimerState(timerId, 3); // timerId와 3(재시작) 전달
    };

    //타이머 정지
    const handlePause = () => {
        setIsPaused(true);
        updateTimerState(timerId, 1); // timerId와 1 (일시 정지) 전달
    };

    //타이머 종료 후 마이페이지로 이동
    const handleEnd = () => {
        setIsActive(false);
        setTime(0);
        updateTimerState(timerId, 2); // timerId와 2 (종료) 전달
        navigate('/mypage');
    };

    // 모달 열기
    const openModal = (part) => {
        setCurrentPart(part);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPart(null);
    };

    return (
        <div className='runningTimer'>
            <div className='runningTimer-container'>
                <h2><span className='userName'>{nickname}</span> 님의<br />건강한 개발을 응원합니다.</h2>
                {timerDetails && (
                    <p><span className="timeInterval">{formatCycleTime(timerDetails.cycle)}</span>마다 설정한 신체부위별 스트레칭 시작!</p>
                )}
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
        
                {timerDetails && (
                        <div className='bodyPartHistory-container'>
                            {timerDetails.parts.map((part, index) => (
                                <React.Fragment key={index}>
                                    <div className='bodyPartHistory'>
                                        <div className='historyNum'>{index + 1}</div>
                                        <div className='historyPart'>
                                            {getBodyPartNames(part.partIds)}
                                        </div>
                                    </div>
                                    {/* 마지막 항목이 아닌 경우에만 dot을 추가합니다 */}
                                    {index < timerDetails.parts.length - 1 && (
                                        <div className='dot'>·<br/>·</div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
            
            </div>
            {isModalOpen && (
                <StopwatchModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    partType={currentPart}
                    imgUrls={['url1', 'url2', 'url3']} // 이미지 URL 배열
                    timerId={timerId}
                />
            )}
        </div>
    );
}

export default TimerRunning;
