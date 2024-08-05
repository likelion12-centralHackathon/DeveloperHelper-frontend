import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dropdown from '../components/DropDown.js';
import TimerModal from '../components/TimerModal.js';
import '../assets/styles/TimerSetup.css';
import startBtn from '../assets/img/startBtn.svg';
import timerMentBg from '../assets/img/timerMent_bg.svg';
import mainIcon from '../assets/img/main_icon.svg';

const intervals = [
  { value: '0.5', label: '30분' },
  { value: '1', label: '1시간' },
  { value: '1.5', label: '1시간 30분' },
  { value: '2', label: '2시간' },
  { value: '2.5', label: '2시간 30분' },
  { value: '3', label: '3시간' },
  { value: '3.5', label: '3시간 30분' },
  { value: '4', label: '4시간' },
  { value: '4.5', label: '4시간 30분' },
  { value: '5', label: '5시간' }
];

const bodyParts = [
  { value: '눈', label: '눈', id: 1 },
  { value: '목', label: '목', id: 2 },
  { value: '허리', label: '허리', id: 3 },
  { value: '다리', label: '다리', id: 4 },
  { value: '기타', label: '기타', id: 5 }
];

function TimerSetup() {
  // 백엔드와 연동을 위한 상태
  const [accessToken, setAccessToken] = useState('');
  const [isExplanationVisible, setIsExplanationVisible] = useState(true);

  // 로컬 스토리지에서 accessToken을 가져오는 함수
  const getAccessToken = () => {
    const token = localStorage.getItem('accessToken');
    return token || ''; // 토큰이 없으면 빈 문자열 반환
  };
  //fcm토큰 가져오기
  const getDeviceToken = () => {
    const fcmToken = localStorage.getItem('fcmToken');
    return fcmToken || ''; // 토큰이 없으면 빈 문자열 반환
  };
  

  // 타이머를 API로부터 가져오는 함수
  const fetchTimers = async (token) => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/timer', // 적절한 엔드포인트로 수정
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true // 자격 증명 포함
        }
      );
      console.log('Fetched timers response:', response);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch timers', error);
      return { code: 500, message: 'Error fetching timers', data: [] };
    }
  };

  useEffect(() => {
    const fetchTimersData = async () => {
      const token = getAccessToken();
      if (token) {
        const response = await fetchTimers(token);
        if (response.code === 200) {
          setTimers(response.data);
          if (response.data.length > 0) {
            setIsExplanationVisible(false);
          }
        }
      }
    };

    fetchTimersData();
  }, []); // 빈 배열로 의존성 설정, 컴포넌트가 마운트될 때 한 번만 호출됩니다.

  //타이머 정보 저장하는 함수
  const saveTimerSettingsToServer = async () => {
    const token = getAccessToken();
    const deviceToken = getDeviceToken(); // 로컬스토리지에서 fcmToken 가져오기
  
    if (!token) {
      console.error('Access token is missing');
      return;
    }
  
    const requestData = {
      deviceToken: deviceToken, // 가져온 deviceToken 설정
      isPermanent: true, // 일회용인지 저장할 것인지 결정
      name: newTimerName, // 타이머 이름
      cycle: parseFloat(selectedInterval.value), // 주기 (숫자 형태로 변환)
      isSettingByUser: selectedMode === 'custom', // 사용자가 설정했는지 랜덤인지
      parts: selectedMode === 'custom' ? cycles.map(cycle => ({
        partIds: cycle.bodyParts.map(bodyPart => bodyPart.id)
      })) : undefined // 직접 설정이 아닐 경우 parts는 포함하지 않음
    };
  
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/timer',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      console.log('Save timer settings response:', response);
      if (response.status === 200) {
        console.log('타이머 설정이 성공적으로 저장되었습니다.');
        // 응답에서 타이머 ID를 추출하여 클라이언트 상태를 업데이트할 수 있음
        // 예를 들어, response.data.timerId를 사용하여 업데이트
      }
    } catch (error) {
      console.error('타이머 설정 저장 실패:', error);
    }
  };
  
  

  // 프론트 작업 코드
  const navigate = useNavigate();
  const [timers, setTimers] = useState([]);
  const [selectedTimerIndex, setSelectedTimerIndex] = useState(null);
  const [timerSettings, setTimerSettings] = useState({});
  const [selectedInterval, setSelectedInterval] = useState(intervals[1]);
  const [selectedMode, setSelectedMode] = useState('custom');
  const [cycles, setCycles] = useState([{ id: Date.now(), bodyParts: [bodyParts[0]] }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTimerName, setNewTimerName] = useState('');

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 타이머 데이터를 불러옴
  useEffect(() => {
    const storedData = localStorage.getItem('timerData');
    if (storedData) {
      setTimerSettings(JSON.parse(storedData));
    }
  }, []);

  
  // 새로운 타이머를 추가하는 함수
  const addTimer = () => {
    const newTimer = { name: '새로운 타이머' };
    setTimers((prevTimers) => {
      const updatedTimers = [newTimer, ...prevTimers];
      setSelectedTimerIndex(0);
      setIsExplanationVisible(false); 
      return updatedTimers;
    });
    setSelectedInterval(intervals[1]);
    setSelectedMode('custom');
    setCycles([{ id: Date.now(), bodyParts: [bodyParts[0]] }]);
  };

  const selectTimer = async (index) => {
    const selectedTimer = timers[index];
    setSelectedTimerIndex(index);
  
    // 상태를 초기화
    setSelectedInterval(intervals[1]);
    setSelectedMode('custom');
    setCycles([]); // 이전 사이클 상태를 초기화
    setNewTimerName('');
  
    if (selectedTimer) {
      const timerId = selectedTimer.timerId;
  
      if (timerId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/timer/${timerId}`, {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`
            }
          });
  
          if (response.status === 200) {
            const settings = response.data.data;
  
            // 선택된 주기 및 모드 설정
            setSelectedInterval({ value: settings.cycle.toString(), label: `${settings.cycle}시간` });
            setSelectedMode(settings.settingByUser ? 'custom' : 'random');
  
            // 사이클 상태 설정
            setCycles(settings.parts.map((part, index) => ({
              id: index, // 서버에서 제공된 ID를 사용하는 것이 좋지만, 예제로 index를 사용
              bodyParts: part.partIds.map(id => bodyParts.find(bp => bp.id === id))
            })));
  
            // 타이머 이름 설정
            setNewTimerName(settings.name || '');
          }
        } catch (error) {
          console.error('Failed to fetch timer details:', error);
        }
      } else {
        console.error('Selected timer has no ID.');
      }
    }
  };
  
  
  

  // 타이머 설정을 저장하는 함수 (모달 창을 엶)
  const saveSettings = () => {
    setIsModalOpen(true); // Open the modal to edit the timer name
  };

  const handleModalSave = async () => {
    const timerName = newTimerName.trim() || '새로운 타이머';

    if (selectedTimerIndex !== null) {
      try {
        await axios.post(
          'http://localhost:8080/api/v1/timer',
          {
            deviceToken: localStorage.getItem('fcmToken') || '',
            isPermanent: true,
            name: timerName,
            cycle: parseFloat(selectedInterval.value),
            isSettingByUser: selectedMode === 'custom',
            parts: cycles.map(cycle => ({
              partIds: cycle.bodyParts.map(part => part.id)
            }))
          },
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`
            }
          }
        );

        // 클라이언트 상태 업데이트
        const updatedTimers = timers.map((timer, index) =>
          index === selectedTimerIndex ? { ...timer, name: timerName } : timer
        );
        setTimers(updatedTimers);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Failed to save timer settings:', error);
      }
    }
  };
  


  // 새로운 스트레칭 사이클을 추가하는 함수
  const addCycle = () => {
    if (cycles.length < 4) {
      setCycles([...cycles, { id: Date.now(), bodyParts: [bodyParts[0]] }]);
    }
  };

  // 특정 사이클에 새로운 신체 부위를 추가하는 함수
  const addBodyPart = (cycleId) => {
    setCycles(cycles.map(cycle => {
      if (cycle.id === cycleId) {
        if (cycle.bodyParts.length < 4) {
          return { ...cycle, bodyParts: [...cycle.bodyParts, bodyParts[0]] };
        }
      }
      return cycle;
    }));
  };

  // 신체 부위 선택을 처리하는 함수
  const handleBodyPartSelect = (cycleId, index, option) => {
    setCycles(cycles.map(cycle => {
      if (cycle.id === cycleId) {
        const updatedBodyParts = cycle.bodyParts.map((part, i) =>
          i === index ? option : part
        );
        return { ...cycle, bodyParts: updatedBodyParts };
      }
      return cycle;
    }));
  };

  // 특정 사이클을 삭제하는 함수
  const removeCycle = (cycleId) => {
    setCycles(cycles.filter(cycle => cycle.id !== cycleId));
  };

  return (
    <div className='timerSetup'>
      <div className='timerSetup-container'>
        <h2>타이머 설정</h2>
        <div>
          <p className='timer-list'>저장된 타이머</p>
          <p className='timer-list-noti'>* 중복 알람은 불가합니다.</p>
          <div className='timerBtn-container'>
            <button className='plusBtn' onClick={addTimer}>+</button>
            {timers.map((timer, index) => (
              <div
                key={timer.timerId}
                className={`timerBtn ${selectedTimerIndex === index ? 'selected' : ''}`}
                onClick={() => selectTimer(index)}
              >
                {timer.name}
              </div>
            ))}
          </div>
        </div>
        <div className='timer-explanation-container' style={{ display: isExplanationVisible ? 'block' : 'none' }}>
            <div className='timer-explanation'>
                <img src={timerMentBg} alt='bg'></img>
                <img className='timerMent-icon' src={mainIcon} alt="icon"></img>
                <div className='timerMent-container'>
                <h3>추가버튼을 눌러 나만의 타이머를 만들고 개발을 시작해보세요!</h3>
                <h1>설정한 시간과 신체부위에 맞게 스트레칭이 시작됩니다.</h1>
                </div>
            </div>
        </div>
        {selectedTimerIndex !== null && (
          <div className='timerSetting'>
            <div className='timerinfo-container'>
              <button className='timer-saveBtn' onClick={saveSettings}>저장</button>
              <div className='timerInfo'>
                <div className='timerInfo-content-container'>
                  <p className='timerInfo-content'>스트레칭 주기</p>
                  <Dropdown
                    options={intervals}
                    placeholder="Select Interval"
                    selectedOption={selectedInterval}
                    onSelect={setSelectedInterval}
                  />
                </div>
                <div className='timerInfo-content-container'>
                  <p className='timerInfo-content'>주기별 스트레칭 부위</p>
                  <button
                    className={`areaBtn ${selectedMode === 'random' ? 'selected' : ''}`}
                    onClick={() => setSelectedMode('random')}
                  >
                    랜덤
                  </button>
                  <button
                    className={`areaBtn ${selectedMode === 'custom' ? 'selected' : ''}`}
                    onClick={() => setSelectedMode('custom')}
                  >
                    개인설정
                  </button>
                </div>
                {selectedMode === 'custom' && (
                  <div className='timerInfo-detail-container'>
                    <p>*구성된 번호에 따라 반복적으로 스트레칭이 구성됩니다.</p>
                    {cycles.map(cycle => (
                      <div key={cycle.id} className='stretchCycle'>
                        <div className='cycleNum'>{cycles.indexOf(cycle) + 1}</div>
                        {cycle.bodyParts.map((bodyPart, index) => (
                          <Dropdown
                            key={index}
                            options={bodyParts}
                            placeholder="Select Body Part"
                            selectedOption={bodyPart}
                            onSelect={(option) => handleBodyPartSelect(cycle.id, index, option)}
                          />
                        ))}
                        {cycle.bodyParts.length < 4 && (
                            <button className='addBtn' onClick={() => addBodyPart(cycle.id)}>+</button>
                          )}
                        <button className='removeBtn' onClick={() => removeCycle(cycle.id)}>삭제</button>
                      </div>
                    ))}
                    <p>*4개까지 구성가능합니다.</p>
                    {cycles.length < 4 && (
                      <button className='CycleBtn' onClick={addCycle}>추가</button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button className="timerSetup-startBtn">
              <img src={startBtn} alt='start button'/>
              <p>개발시작</p>
            </button>
          </div>
        )}
      </div>
      <TimerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        value={newTimerName}
        onChange={(e) => setNewTimerName(e.target.value)}
      />
    </div>
  );
}

export default TimerSetup;

