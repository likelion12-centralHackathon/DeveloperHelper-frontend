import React, { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../assets/styles/Mypage.css';
import moment from "moment";

function Mypage() {
    const [date, setDate] = useState(new Date());
    const [progress, setProgress] = useState({
        eye: 0,
        neck: 0,
        back: 0,
        legs: 0,
        others: 0
    });

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);

        // 선택한 날짜에 대한 진행 데이터를 가져옵니다 (여기서는 예시 데이터를 사용합니다)
        const dummyProgressData = {
            '2024-07-14': { eye: 2, neck: 5, back: 3, legs: 7, others: 1 }
        };

        const dateKey = selectedDate.toISOString().split('T')[0];
        setProgress(dummyProgressData[dateKey] || { eye: 0, neck: 0, back: 0, legs: 0, others: 0 });
    };

    return (
        <div className="mypage-container">
            <div className="calendar-container">
                <Calendar
                   value={date}
                   onChange={handleDateChange}
                   formatDay={(locale, date) => moment(date).format("D")} // 일 제거 숫자만 보이게
                   formatYear={(locale, date) => moment(date).format("YYYY")} // 네비게이션 눌렀을때 숫자 년도만 보이게
                   formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")} // 네비게이션에서 2023. 12 이렇게 보이도록 설정
                   showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
                   next2Label={null} // +1년 & +10년 이동 버튼 숨기기
                   prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
                   minDetail="year" // 10년단위 년도 숨기기
                   locale="en-US"
                />
            </div>
            <div className="progress-container">
                <h2 className="progressTitle"><span className="progressTitle-name">김멋사 개발자</span> 님의 진행사항</h2>
                <div className="progress-summary">
                    <div className="progress-summary-content">
                    <h3>새로운 시작</h3>
                    <p>진행 순서</p>
                    <div>
                        <div  className='progress-stretchCycle'>
                        <div className='progress-cycleNum'>1</div>
                        <div className="progress-bodypart-container">
                            <div className='progress-bodypart'>다리</div>
                            <div className='progress-bodypart'>다리</div>
                            <div className='progress-bodypart'>다리</div>
                            <div className='progress-bodypart'>다리</div>
                        </div>
                        </div>
                        </div>
                    
                    </div>
                </div>
                <div className="progress-pie-chart-container">
                    {/* 차트 라이브러리 써서 이부분에 원형 차트 그래프를 넣고 싶음 */}
                    <h3>부위 별 스트레칭 비율</h3>
                    <p>눈: {progress.eye}분</p>
                    <p>목: {progress.neck}분</p>
                    <p>허리: {progress.back}분</p>
                    <p>다리: {progress.legs}분</p>
                    <p>기타: {progress.others}분</p>
                </div>
                <div className="satisfaction-container">
                    <h3>신체부위별 만족도</h3>
                    <div className="rating">
                        <span>전체: ★★★★☆</span>
                    </div>
                    <textarea placeholder="잘한점과 못한점을 적어주세요." />
                    <button>저장</button>
                </div>
            </div>
        </div>
    );
}

export default Mypage;

