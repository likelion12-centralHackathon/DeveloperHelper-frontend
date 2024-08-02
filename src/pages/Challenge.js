import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import '../assets/styles/Challenge.css';
import healthIcon from '../assets/img/challengeIcon/health3.svg';
import arrow from '../assets/img/Vector_gray.svg';
import person from '../assets/img/person.svg';
import developeIcon from '../assets/img/challengeIcon/develope5.svg';
import freeIcon from '../assets/img/challengeIcon/free1.svg';
import CreateChallengeModal from "../components/CreateChallengeModal";

function Challenge() {
    const navigate = useNavigate();
    
    const navigateEndChallenge = () =>{
        navigate('/done-challenge');
    }

    const navigateChallengeDetail = () => {
        navigate('/challenge-detail');
    }

    const [isModalOpen, setModalOpen] = useState(false);
    const [challenges, setChallenges] = useState([]);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const saveChallenge = (challenge) => {
        setChallenges([...challenges, challenge]);
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
                        <div className='proceedingChallenge'>
                            <div className='proceedingChallenge-icon-container'>
                                <div className='proceedingChallenge-icon'>
                                <img src={healthIcon} alt='icon'></img>
                                </div>
                            </div>
                            <div className='proceedingChallenge-name'>
                               3개의 신체 부위 운동하기
                            </div>
                        </div>
                        <div className='proceedingChallenge'>
                            <div className='proceedingChallenge-icon-container'>
                                <div className='proceedingChallenge-icon'>
                                <img src={healthIcon} alt='icon'></img>
                                </div>
                            </div>
                            <div className='proceedingChallenge-name'>
                               3개의 신체 부위 운동하기
                            </div>
                        </div>
                        <div className='proceedingChallenge'>
                            <div className='proceedingChallenge-icon-container'>
                                <div className='proceedingChallenge-icon'>
                                <img src={healthIcon} alt='icon'></img>
                                </div>
                            </div>
                            <div className='proceedingChallenge-name'>
                               3개의 신체 부위 운동하기
                            </div>
                        </div>
                        <div className='proceedingChallenge'>
                            <div className='proceedingChallenge-icon-container'>
                                <div className='proceedingChallenge-icon'>
                                <img src={healthIcon} alt='icon'></img>
                                </div>
                            </div>
                            <div className='proceedingChallenge-name'>
                               3개의 신체 부위 운동하기
                            </div>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="challenge-section">
                    <div className="challengeHeader">
                        <h2 className="section-title">챙김이 챌린지</h2>
                        <button className='makeChallengeBtn' onClick={openModal}>챌린지 생성하기</button>
                    </div>
                    <div className="challengeFilter-container ">
                        <button className="challengeFilter">전체</button>
                        <button className="challengeFilter">개발</button>
                        <button className="challengeFilter">건강</button>
                        <button className="challengeFilter">자유</button>
                    </div>
                    <div className="showingChallenge-container">
                        <div className="showingChallenge">
                            <div className="showingChallenge-detailInfo">
                                <div className="showingChallenge-person">
                                    <img src={person} alt='person'></img>
                                    <p className="peopleNum">15</p>
                                </div>
                                <p className='duration'>마감 16일 전</p>
                            </div>
                            <button className="showChallengeDetailBtn">상세보기</button>
                            <div className="showingChallenge-icon-container">
                                <img src={freeIcon}></img>
                            </div>
                            <h1 className="showingChallenge-name">3개의 신체부위 운동하기</h1>
                        </div>
                        <div className="showingChallenge">
                            <div className="showingChallenge-detailInfo">
                                <div className="showingChallenge-person">
                                    <img src={person} alt='person'></img>
                                    <p className="peopleNum">15</p>
                                </div>
                                <p className='duration'>마감 16일 전</p>
                            </div>
                            <button className="showChallengeDetailBtn">상세보기</button>
                            <div className="showingChallenge-icon-container">
                                <img src={developeIcon}></img>
                            </div>
                            <h1 className="showingChallenge-name">3개의 신체부위 운동하기</h1>
                        </div>
                        <div className="showingChallenge">
                            <div className="showingChallenge-detailInfo">
                                <div className="showingChallenge-person">
                                    <img src={person} alt='person'></img>
                                    <p className="peopleNum">15</p>
                                </div>
                                <p className='duration'>마감 16일 전</p>
                            </div>
                            <button className="showChallengeDetailBtn">상세보기</button>
                            <div className="showingChallenge-icon-container">
                                <img src={freeIcon}></img>
                            </div>
                            <h1 className="showingChallenge-name">3개의 신체부위 운동하기</h1>
                        </div>
                        <div className="showingChallenge">
                            <div className="showingChallenge-detailInfo">
                                <div className="showingChallenge-person">
                                    <img src={person} alt='person'></img>
                                    <p className="peopleNum">15</p>
                                </div>
                                <p className='duration'>마감 16일 전</p>
                            </div>
                            <button className="showChallengeDetailBtn">상세보기</button>
                            <div className="showingChallenge-icon-container">
                                <img src={healthIcon}></img>
                            </div>
                            <h1 className="showingChallenge-name">3개의 신체부위 운동하기</h1>
                        </div>
                        {challenges.map((challenge, index) => (
                        <div key={index} className="showingChallenge">
                            <div className="showingChallenge-detailInfo">
                                <div className="showingChallenge-person">
                                    <img src={person} alt='person'></img>
                                    <p className="peopleNum">{challenge.peopleNum}</p>
                                </div>
                                <p className='duration'>{challenge.duration}</p>
                            </div>
                            <button className="showChallengeDetailBtn" onClick={navigateChallengeDetail}>상세보기</button>
                            <div className="showingChallenge-icon-container">
                                <img src={challenge.icon} alt='icon'></img>
                            </div>
                            <h1 className="showingChallenge-name">{challenge.title}</h1>
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