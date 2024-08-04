import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/NavBar.css';

function NavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const hideLogout = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/Home">
           개발자챙김이
          </Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/Home" className={isActive('/Home') ? 'active' : ''}>홈</Link></li>
          <li><Link to="/timer" className={isActive('/timer'|| '/timer-running') ? 'active' : ''}>타이머</Link></li>
          <li><Link to="/challenge" className={isActive('/challenge') ? 'active' : ''}>챌린지</Link></li>
          <li><Link to="/stretching" className={isActive('/stretching') ? 'active' : ''}>스트레칭</Link></li>
          <li><Link to="/mypage" className={isActive('/mypage') ? 'active' : ''}>마이페이지</Link></li>
        </ul>
        {!hideLogout && (
          <ul className="navbar-logout">
            <li><Link to="/login">로그아웃</Link></li>
          </ul>
        )}
      </nav>
      <hr />
    </div>
  );
}

export default NavBar;


