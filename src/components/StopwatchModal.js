import React, { useState } from "react";
import '../assets/styles/StopwatchModal.css';
import axios from 'axios';

function StopwatchModal({ isOpen, onClose, partType, imgUrls, timerId }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const isLastImage = currentIndex === imgUrls.length - 1;
    const isFirstImage = currentIndex === 0;

    if (!isOpen) return null;

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imgUrls.length);
    };

    const handleStartStretching = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.post(
                `http://localhost:8080/api/v1/timer/state/${timerId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    params: {
                        timerState: 4, // 스트레칭 시작
                        part: partType
                    }
                }
            );
            handleNext();
        } catch (error) {
            console.error('스트레칭 시작 실패:', error);
        }
    };

    const handleStartDevelop = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.post(
                `http://localhost:8080/api/v1/timer/state/${timerId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    params: {
                        timerState: 3, // 타이머 재시작
                        part: -1
                    }
                }
            );
            onClose();
        } catch (error) {
            console.error('개발 시작 실패:', error);
        }
    };

    return (
        <div className="stopwatchModal-overlay">
            <div className="stopwatchModal-container">
                <div className="stopwatchModal-header">
                    <h2>{partType} 건강을 위한 스트레칭</h2>
                    <button className="close-btn" onClick={onClose}>X</button>
                </div>
                <div className="stopwatchModal-stretching-container">
                    <img
                        src={imgUrls[currentIndex]}
                        alt={`Stretching ${currentIndex + 1}`}
                        className="stopwatchModal-stretching"
                    />
                </div>
                <div className="stopwatchBtn-container">
                    <button
                        className="stopwatchBtn"
                        onClick={
                            isFirstImage
                                ? handleStartStretching
                                : isLastImage
                                    ? handleStartDevelop
                                    : handleNext
                        }
                    >
                        {isFirstImage ? '시작' : isLastImage ? '개발 시작' : '다음'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StopwatchModal;
