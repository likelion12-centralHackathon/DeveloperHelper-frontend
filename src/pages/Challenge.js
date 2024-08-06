import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/styles/Challenge.css';
import healthIcon from '../assets/img/challengeIcon/health3.svg';
import arrow from '../assets/img/Vector_gray.svg';
import person from '../assets/img/person.svg';
import developeIcon from '../assets/img/challengeIcon/develope5.svg';
import freeIcon from '../assets/img/challengeIcon/free1.svg';
import CreateChallengeModal from "../components/CreateChallengeModal";
import axios from 'axios';

function Challenge() {
    const navigate = useNavigate();

    const navigateEndChallenge = () => {
        navigate('/done-challenge');
    }

    const navigateChallengeDetail = () => {
        navigate('/challenge-detail');
    }

    const [isModalOpen, setModalOpen] = useState(false);
    const [challenges, setChallenges] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const saveChallenge = (challenge) => {
        setChallenges([...challenges, challenge]);
    };

    useEffect(() => {
        fetchChallenges(selectedCategory);
    }, [selectedCategory]);

    const fetchChallenges = async (category) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error("No access token found");
            return;
        }
    
        try {
            const response = await axios.get('http://localhost:8080/api/v1/challengeList', {
                params: {
                    category: category === "ALL" ? "ALL" : category
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setChallenges(response.data.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    // JWT 토큰 만료
                    alert("로그인이 필요합니다. 다시 로그인해주세요.");
                    navigate('/login');
                } else if (error.response.status >= 500) {
                    // 서버 오류
                    alert("서버에서 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
                } else {
                    // 다른 클라이언트 오류
                    console.error("Failed to fetch challenges:", error.response.data);
                }
            } else {
                // 네트워크 오류
                console.error("Network error:", error.message);
            }
        }
    };
    
    

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };


    return (
        <div className="challenge">
            <div className="challenge-container">
                <h2 className="title">챙김이 챌린지</h2>
                <div className="proceedingChallenge-section">
                    <h3 className='section-title'>진행중 챌린지</h3>
                    <div className="endChallengeBtn" onClick={navigateEndChallenge}>
                        <p>참여완료 챌린지</p>
                        <img src={arrow} alt='arrow'></img>
                    </div>
                    <div className="proceedingChallenge-container">
                        {/* 진행중 챌린지 리스트 */}
                    </div>
                </div>
                <hr></hr>
                <div className="challenge-section">
                    <div className="challengeHeader">
                        <h2 className="section-title">챙김이 챌린지</h2>
                        <button className='makeChallengeBtn' onClick={openModal}>챌린지 생성하기</button>
                    </div>
                    <div className="challengeFilter-container">
                        <button
                            className={`challengeFilter ${selectedCategory === "ALL" ? "selected" : ""}`}
                            onClick={() => handleCategoryClick("ALL")}
                        >
                            전체
                        </button>
                        <button
                            className={`challengeFilter ${selectedCategory === "DEVELOPMENT" ? "selected" : ""}`}
                            onClick={() => handleCategoryClick("DEVELOPMENT")}
                        >
                            개발
                        </button>
                        <button
                            className={`challengeFilter ${selectedCategory === "HEALTH" ? "selected" : ""}`}
                            onClick={() => handleCategoryClick("HEALTH")}
                        >
                            건강
                        </button>
                        <button
                            className={`challengeFilter ${selectedCategory === "FREE" ? "selected" : ""}`}
                            onClick={() => handleCategoryClick("FREE")}
                        >
                            자유
                        </button>
                    </div>
                    <div className="showingChallenge-container">
                        {challenges.map((challenge, index) => (
                            <div key={index} className="showingChallenge">
                                <div className="showingChallenge-detailInfo">
                                    <div className="showingChallenge-person">
                                        <img src={person} alt='person' />
                                        <p className="peopleNum">15</p> {/* 예시로 고정된 값을 사용했습니다. 실제 데이터에서 가져오도록 수정 필요 */}
                                    </div>
                                    <p className='duration'>마감 {Math.floor((new Date(challenge.end_date) - new Date()) / (1000 * 60 * 60 * 24))}일 전</p>
                                </div>
                                <button className="showChallengeDetailBtn" onClick={navigateChallengeDetail}>상세보기</button>
                                <div className="showingChallenge-icon-container">
                                    <img src={
                                        challenge.ch_category === "DEVELOPMENT" ? developeIcon :
                                        challenge.ch_category === "HEALTH" ? healthIcon : freeIcon
                                    } alt='icon' />
                                </div>
                                <h1 className="showingChallenge-name">{challenge.ch_title}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <CreateChallengeModal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                saveChallenge={saveChallenge}
            />
        </div>
    );
}

export default Challenge;

