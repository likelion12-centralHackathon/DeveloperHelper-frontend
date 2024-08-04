import React from "react";
import { useNavigate } from "react-router-dom";
import '../assets/styles/ChallengeDetail.css';
import person from '../assets/img/person.svg';
import healthIcon from '../assets/img/challengeIcon/health3.svg';
import backBtn from '../assets/img/back_arrow.svg';

function ChallengeDetail() {

    const navigate = useNavigate();

    const navigateChallengeHome = () => {
        navigate('/challenge');
    }
    return(
        <div className="challengeDetail">
            <div className="challengeDetial-container">
                <div className="challengeDetail-content">
                    <button className='backBtn' onClick={navigateChallengeHome}>
                        <img src={backBtn} alt='back'></img>
                    </button>
                    <h2>
                        3개 신체부위 운동
                    </h2>
                    <div className="challengeDetail-card-container">
                        <div className="challengeDetail-person">
                            <img src={person} alt='person'></img>
                            <p className="challengeDetail-peopleNum">23</p>
                        </div>
                        <div className="challengeDetail-icon-container">
                            <img src={healthIcon}></img>
                        </div>
                    </div>
                    <p className="challengeDetail-contentment">개발자분들은 오랜 시간 동안 앉아서 작업을 하기 때문에
신체 특정 부위를 강화하고 유지하는 것이 중요합니다!
3개의 신체부위 운동으로 건강을 유지하면서 효율적으로 건강한
작업을 할 수 있도록 도와주는 챌린지입니다. </p>
                        <button className="joinBtn">참여하기</button>
                </div>
            </div>
        </div>
    )
}

export default ChallengeDetail;