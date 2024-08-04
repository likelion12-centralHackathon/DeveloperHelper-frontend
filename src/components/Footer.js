//Footer.js
import React from 'react';
import {useLocation} from 'react-router-dom';
import '../assets/styles/Footer.css';
import footerIcon from '../assets/img/main_icon.svg';

function Footer(){
    const location = useLocation();

    const hideFooter = location.pathname === '/login' || location.pathname === '/signup';

    return(
        !hideFooter && (
        <div className='footer'>
            <div className='footer-container'>
                <div className='footer-icon-container'>
                    <h2 className='footer-logo'>개발자챙김이</h2>
                    <img className='footer-icon'src={footerIcon} alt="Footer Icon"></img>
                </div>
                <p>개발자챙김이를 방문해주셔서 감사합니다!</p>
                <p className='description'>오늘 하루도 건강한 개발 생활을 즐기셨기를 바라며 계속해서 유용한 정보를 제공할 수 있도록 최선을 다하겠습니다.</p>
                <p className='icon-copyright description'>Icons made by Freepik from <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">www.freepik.com</a></p>
                <p className='copyright'>ⓒ 2024 developerhleper. All rights reserved.</p>
            </div>
        </div>
        )
    );
}

export default Footer;