import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/AdditionalInfo.css';

function AdditionalInfo() {
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        birth: '',  // 'YYYY-MM-DD' 형식으로 저장
        gender: 'female'
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 닉네임 길이 체크
        if (formData.nickname.length < 3) {
            alert('닉네임은 3글자 이상이어야 합니다.');
            return;
        }

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/v1/users/join/kakao', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log('Response:', response);
            if (response.status === 200) {
                alert(`${response.data.nickname}님 회원가입을 환영합니다!!`);
                navigate('/home');
            }
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className='additional-info'>
            <div className="additional-info-container">
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>이름</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>생년월일</label>
                    <input
                        type="date"
                        name="birth"
                        value={formData.birth}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>성별</label>
                    <div className='gender-container'>
                        <label className='gender'>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={handleChange}
                            />
                            여성
                        </label>
                        <label className='gender'>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={handleChange}
                            />
                            남성
                        </label>
                    </div>
                </div>
                <div className='button-container'>
                    <button type="submit">가입하기</button>
                </div>
            </form>
        </div>
        </div>
        
    );
}

export default AdditionalInfo;


    
