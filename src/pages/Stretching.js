import React from "react";
import '../assets/styles/Stretching.css'
import searchBarIcon from '../assets/img/searchBar_icon.svg';
import mainStretch from '../assets/img/mainStretch.svg';
import mainPlayBtn from '../assets/img/main_playBtn.svg';
import playBtn from '../assets/img/playBtn.svg';

function Stretching() {
    return(
        <div className="stretching">
            <div className="stretching-container">
                <h2 className="stretchingName">
                    스트레칭 영상
                </h2>
                <div className="mainStretch-container">
                    <div className="mainStretch-ment-container">
                        <p>챙김이가 추천하는 스트레칭 !</p>
                        <h2>개발자의 맨몸<br/>
                        운동 도전기</h2>
                    </div>
                    <div className="mainStretch-play-container">
                        <button className="mainStretch-playBtn"><img src={mainPlayBtn}></img></button>
                        <h3>8:31</h3>
                    </div>
                    <div className="mainStretch-img">
                        <img src={mainStretch}></img>
                    </div>
                </div>
                <div className="searchBar-container">
                    <input className="searchBar">
                    </input>
                    <div className='searchBar-icon-container'><img src={searchBarIcon} alt='searchBar icon'></img></div>
                    <div className="searchBar-filter-container">
                        <button className="searchBar-filter">어깨</button>
                        <button className="searchBar-filter">목</button>
                        <button className="searchBar-filter">허리</button>
                        <button className="searchBar-filter">손목</button>
                        <button className="searchBar-filter">다리</button>
                    </div>
                </div>
                <div className="search-content-container">
                    <div className="search-content">
                        <img className="videoImg" src={mainStretch}></img>
                        <h2 className="videoName">비대칭 옆구리 간단한 운동</h2>
                        <div className="playBtn-container">
                            <button className="playBtn"><img src={playBtn}></img></button>
                            <h3 className="videoTime">10:42</h3>
                        </div>
                    </div>
                    <div className="search-content">
                        <img className="videoImg" src={mainStretch}></img>
                        <h2 className="videoName">비대칭 옆구리 간단한 운동</h2>
                        <div className="playBtn-container">
                            <button className="playBtn"><img src={playBtn}></img></button>
                            <h3 className="videoTime">10:42</h3>
                        </div>
                    </div>
                    <div className="search-content">
                        <img className="videoImg" src={mainStretch}></img>
                        <h2 className="videoName">비대칭 옆구리 간단한 운동</h2>
                        <div className="playBtn-container">
                            <button className="playBtn"><img src={playBtn}></img></button>
                            <h3 className="videoTime">10:42</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stretching;