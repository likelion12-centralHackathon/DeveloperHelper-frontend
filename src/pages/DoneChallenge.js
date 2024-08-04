import React from "react";
import '../assets/styles/DoneChallenge.css';
import healthIcon from '../assets/img/challengeIcon/health3.svg';

function DoneChallenge() {

    return(
        <div className="donechallenge">
        <div className="donechallenge-container">
            <h2 className="title">참여완료 챌린지</h2>
            <div className="doneChallenge-section">
                <h3 className='section-title'>참여완료 챌린지</h3>
                <div className="showDoneChallenge-container">
                    <div className='showDoneChallenge'>
                        <div className='showDoneChallenge-icon-container'>
                            <div className='showDoneChallenge-icon'>
                            <img src={healthIcon} alt='icon'></img>
                            </div>
                        </div>
                        <div className='showDoneChallenge-name'>
                           3개의 신체 부위 운동하기
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
        </div>
    );
}

export default DoneChallenge;