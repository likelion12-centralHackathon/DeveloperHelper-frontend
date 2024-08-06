import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../assets/styles/Mypage.css';
import moment from "moment";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const bodyParts = [
    { value: '눈', label: '눈', id: 1 },
    { value: '목', label: '목', id: 2 },
    { value: '허리', label: '허리', id: 3 },
    { value: '다리', label: '다리', id: 4 },
    { value: '기타', label: '기타', id: 5 }
];

function Mypage() {
    const [accessToken, setAccessToken] = useState(getAccessToken());
    const [nickname, setNickname] = useState('');
    const [timerhistory, setTimerhistory] = useState([]);
    const [isHistoryVisible, setIsHistoryVisible] = useState(true);
    const [date, setDate] = useState(new Date());
    const [stretchingData, setStretchingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    function getAccessToken() {
        return localStorage.getItem('accessToken') || '';
    }

    async function refreshAccessToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');

        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/refresh', { refreshToken });
            const newToken = response.data.accessToken;
            localStorage.setItem('accessToken', newToken);
            setAccessToken(newToken);
            return newToken;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            throw error;
        }
    }

    const fetchWithAuth = async (url, options = {}) => {
        const token = getAccessToken();
        try {
            const response = await axios(url, { ...options, headers: { ...options.headers, 'Authorization': `Bearer ${token}` } });
            if (response.status === 403) {
                const newToken = await refreshAccessToken();
                return await axios(url, { ...options, headers: { ...options.headers, 'Authorization': `Bearer ${newToken}` } });
            }
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };

    const fetchTimerhistory = async (date) => {
        try {
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/timer/search/${date}`);
            if (response.status === 200) {
                setTimerhistory(response.data.data || []);
                setIsHistoryVisible(response.data.data.length === 0);
            }
        } catch (error) {
            console.error('Failed to fetch timers', error);
        }
    };

    const fetchStretchingData = async (date) => {
        try {
            console.log(`Fetching stretching data for date: ${date}`); // 추가된 로그
            const response = await fetchWithAuth(`http://localhost:8080/api/v1/timer/static/${date}`);
            if (response.status === 200) {
                console.log('Stretching data fetched successfully:', response.data); // 추가된 로그
                setStretchingData(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch stretching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        setLoading(true);
        fetchTimerhistory(formattedDate);
        fetchStretchingData(formattedDate);
    }, [date]);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        const formattedDate = moment(newDate).format('YYYY-MM-DD');
        setLoading(true);
        fetchTimerhistory(formattedDate);
        fetchStretchingData(formattedDate);
    };

    useEffect(() => {
        const fetchNickname = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const userId = localStorage.getItem('userId');

                const response = await axios.get(`http://localhost:8080/api/v1/users/info/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
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

    const getBodyPartLabel = (id) => {
        const part = bodyParts.find(part => part.id === id);
        return part ? part.label : 'Unknown';
    };

    const pieChartData = {
        labels: stretchingData.map(data => getBodyPartLabel(data.partType)),
        datasets: [
            {
                data: stretchingData.map(data => data.stretchingTime / 60), // 초를 분으로 변환
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }
        ]
    };

    useEffect(() => {
        console.log('Updated pie chart data:', pieChartData); // 추가된 로그
    }, [stretchingData]);

    return (
        <div className="mypage-container">
            <div className="calendar-container">
                <Calendar
                    value={date}
                    onChange={handleDateChange}
                    formatDay={(locale, date) => moment(date).format("D")}
                    formatYear={(locale, date) => moment(date).format("YYYY")}
                    formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
                    showNeighboringMonth={true}
                    next2Label={null}
                    prev2Label={null}
                    minDetail="year"
                    locale="en-US"
                />
            </div>
            <div className="progress-container">
                <h2 className="progressTitle"><span className="progressTitle-name">{nickname}</span> 님의 진행사항</h2>
                <div className="progress-summary-container">
                    {timerhistory && timerhistory.length > 0 ? (
                        timerhistory.map((timer, index) => (
                            <div key={index} className="progress-summary">
                                <div className="progress-summary-content">
                                    <h3>{timer.name}</h3>
                                    <p>진행 순서</p>
                                    <div>
                                        {timer.parts && timer.parts.length > 0 && timer.parts.map((part, partIndex) => (
                                            <div key={partIndex} className='progress-stretchCycle'>
                                                <div className='progress-cycleNum'>{partIndex + 1}</div>
                                                <div className="progress-bodypart-container">
                                                    {part.partIds && part.partIds.length > 0 && part.partIds.map((partId, idIndex) => (
                                                        <div key={idIndex} className='progress-bodypart'>{getBodyPartLabel(partId)}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>진행 중인 타이머가 없습니다.</div>
                    )}
                </div>
                <div className="progress-pie-chart-container">
                <div>{loading ? (
                    <p>데이터 로딩 중...</p>
                ) : (
                    pieChartData.labels.length > 0 ? (
                        <Pie data={pieChartData} />
                    ) : (
                        <p>해당 날짜의 데이터가 없습니다.</p>
                    )
                )}
                <div>
                    <p>눈 : {stretchingTimes.eye}분</p>
                    <p>목 : {stretchingTimes.neck}분</p>
                    <p>허리 : {stretchingTimes.waist}분</p>
                    <p>다리 : {stretchingTimes.leg}분</p>
                    <p>기타 : {stretchingTimes.etc}분</p>
                </div>
                </div>
                </div>
                <div className="satisfaction-container">
                    <h3>신체부위별 만족도</h3>
                    <div className="satisfactionBtn-container">
                        <button className="satisfactionBtn">전체</button>
                        <button className="satisfactionBtn">눈</button>
                        <button className="satisfactionBtn">목</button>
                        <button className="satisfactionBtn">허리</button>
                        <button className="satisfactionBtn">기타</button>
                    </div>
                    <div className="rating">
                        <div>
                            <div> 전체</div>
                            <div>★★★★☆</div>
                        </div>
                    </div>
                    <textarea className='satisfaction-content'placeholder="잘한점과 못한점을 적어주세요." />
                    <button className="satisfaction-saveBtn">저장</button>
                </div>
            </div>
        </div>
    );
}

export default Mypage;




