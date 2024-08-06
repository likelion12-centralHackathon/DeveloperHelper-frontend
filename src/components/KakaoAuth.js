import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function KakaoAuth() {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTokenAndUserInfo = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const code = queryParams.get('code');
            console.log('Authorization code:', code);

            if (code) {
                try {
                    // 백엔드로 인증 코드 전송하여 JWT 받기
                    const response = await axios.get(`https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/users/login/kakao?code=${code}`, {
                        withCredentials: true
                    });
                    console.log('Backend response:', response);

                    // 응답 데이터에서 accessToken, refreshToken, joined 추출
                    const { accessToken, refreshToken, joined } = response.data.data;
                    console.log('Access Token:', accessToken);
                    console.log('Refresh Token:', refreshToken);
                    console.log('Joined:', joined);

                    // JWT를 로컬 스토리지에 저장
                    if (accessToken && refreshToken) {
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', refreshToken);

                        // 사용자 정보를 요청하여 id를 가져옴
                        const userInfoResponse = await axios.get('https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/users/info', {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            }
                        });
                        const userId = userInfoResponse.data.data.id;
                        localStorage.setItem('userId', userId);

                        // 사용자 상태에 따라 페이지 이동
                        if (joined !== undefined) {
                            if (!joined) {
                                navigate('/additional-info');
                            } else {
                                navigate('/home');
                            }
                        } else {
                            console.error('Joined status is missing');
                            navigate('/login');
                        }
                    } else {
                        console.error('Access Token or Refresh Token is missing');
                        navigate('/login');
                    }
                } catch (error) {
                    console.error('로그인 실패:', error);
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        };

        fetchTokenAndUserInfo();
    }, [navigate]);

    
}

export default KakaoAuth;


