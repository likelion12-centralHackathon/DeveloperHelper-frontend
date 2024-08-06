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
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [isExplanationVisible, setIsExplanationVisible] = useState(true);
  const [timers, setTimers] = useState([]);
  const [selectedTimerIndex, setSelectedTimerIndex] = useState(null);
  const [timerSettings, setTimerSettings] = useState({});
  const [selectedInterval, setSelectedInterval] = useState(intervals[1]);
  const [selectedMode, setSelectedMode] = useState('custom');
  const [cycles, setCycles] = useState([{ id: Date.now(), bodyParts: [bodyParts[0]] }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTimerName, setNewTimerName] = useState('');
  const navigate = useNavigate();

  // 로컬 스토리지에서 accessToken을 가져오는 함수
  function getAccessToken() {
    return localStorage.getItem('accessToken') || '';
  }

  // fcmToken 가져오기
  function getDeviceToken() {
    return localStorage.getItem('fcmToken') || '';
  }

  // 토큰을 갱신하는 함수
  async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');
    if (!refreshToken) throw new Error('No refresh token found');

    try {
      const response = await axios.post('https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/auth/refresh', { refreshToken });
      const newToken = response.data.accessToken;
      localStorage.setItem('accessToken', newToken);
      setAccessToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw error;
    }
  }

  // fetch 요청을 래핑하는 함수
  const fetchWithAuth = async (url, options = {}) => {
    const token = getAccessToken();
    try {
      const response = await axios(url, { ...options, headers: { ...options.headers, 'Authorization': `Bearer ${token}` } });
      if (response.status === 403) { // 액세스 토큰 만료
        const newToken = await refreshAccessToken();
        return await axios(url, { ...options, headers: { ...options.headers, 'Authorization': `Bearer ${newToken}` } });
      }
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // 타이머를 API로부터 가져오는 함수
  const fetchTimers = async () => {
    try {
      const response = await fetchWithAuth('https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/timer');
      if (response.status === 200) {
        setTimers(response.data.data);
        if (response.data.data.length > 0) {
          setIsExplanationVisible(false);
        }
      }
    } catch (error) {
      console.error('Failed to fetch timers', error);
    }
  };

  useEffect(() => {
    fetchTimers();
  }, []);

  // 타이머 정보 저장하는 함수
  const saveTimerSettingsToServer = async () => {
    const deviceToken = getDeviceToken();

    const requestData = {
      deviceToken,
      isPermanent: true,
      name: newTimerName,
      cycle: parseFloat(selectedInterval.value),
      isSettingByUser: selectedMode === 'custom',
      parts: selectedMode === 'custom' ? cycles.map(cycle => ({
        partIds: cycle.bodyParts.map(bodyPart => bodyPart.id)
      })) : undefined
    };

    try {
      const response = await fetchWithAuth('https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/timer', {
        method: 'POST',
        data: requestData
      });
      if (response.status === 200) {
        console.log('타이머 설정이 성공적으로 저장되었습니다.');
      }
    } catch (error) {
      console.error('타이머 설정 저장 실패:', error);
    }
  };

  // 새로운 타이머를 추가하는 함수
  const addTimer = () => {
    const newTimer = { name: '새로운 타이머' };
    setTimers(prevTimers => [newTimer, ...prevTimers]);
    setSelectedTimerIndex(0);
    setIsExplanationVisible(false);
    setSelectedInterval(intervals[1]);
    setSelectedMode('custom');
    setCycles([{ id: Date.now(), bodyParts: [bodyParts[0]] }]);
  };

  // 타이머 버튼을 선택하면 호출되는 함수
  const selectTimer = async (index) => {
    const selectedTimer = timers[index];
    setSelectedTimerIndex(index);
    setSelectedInterval(intervals[1]);
    setSelectedMode('custom');
    setCycles([]);
    setNewTimerName('');

    if (selectedTimer) {
      const timerId = selectedTimer.timerId;
      if (timerId) {
        try {
          const response = await fetchWithAuth(`https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/timer/${timerId}`);
          if (response.status === 200) {
            const settings = response.data.data;
            setSelectedInterval({ value: settings.cycle.toString(), label: `${settings.cycle}시간` });
            setSelectedMode(settings.settingByUser ? 'custom' : 'random');
            setCycles(settings.parts.map((part, index) => ({
              id: index,
              bodyParts: part.partIds.map(id => bodyParts.find(bp => bp.id === id))
            })));
            setNewTimerName(settings.name || '');
            setTimerSettings({
              id: timerId,
              cycle: settings.cycle,
              settingByUser: settings.settingByUser,
              parts: settings.parts,
              name: settings.name || ''
            });
          }
        } catch (error) {
          console.error('Failed to fetch timer details:', error);
        }
      }
    }
  };

  // 타이머 설정을 저장하는 함수 (모달 창을 엶)
  const saveSettings = () => {
    setIsModalOpen(true);
  };

//모달창에서 저장 버튼을 눌렀을 때 함수 
  const handleModalSave = async () => {
    const timerName = newTimerName.trim() || '새로운 타이머';
    if (selectedTimerIndex !== null) {
      try {
        await fetchWithAuth('https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/timer', {
          method: 'POST',
          data: {
            deviceToken: getDeviceToken(),
            isPermanent: true,
            name: timerName,
            cycle: parseFloat(selectedInterval.value),
            isSettingByUser: selectedMode === 'custom',
            parts: cycles.map(cycle => ({
              partIds: cycle.bodyParts.map(part => part.id)
            }))
          }
        });
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

  useEffect(() => {
    console.log('Current timerSettings:', timerSettings);
  }, [timerSettings]);

  //개발 시작버튼을 누르면 실행하는 함수
  const handleStartDevelopment = async () => {
    const selectedTimer = timers[selectedTimerIndex];
    const timerId = selectedTimer ? selectedTimer.timerId : null;
    const timerName = selectedTimer ? selectedTimer.name : '';
    const date = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
  
    if (!timerId) {
      // 타이머 아이디가 없는 경우 새로운 타이머를 생성
      const requestData = {
        deviceToken: getDeviceToken(),
        isPermanent: false, // 새로운 타이머로 설정
        name: newTimerName.trim() || '새로운 타이머',
        cycle: parseFloat(selectedInterval.value),
        isSettingByUser: selectedMode === 'custom',
        parts: cycles.map(cycle => ({
          partIds: cycle.bodyParts.map(part => part.id)
        }))
      };
  
      try {
        const response = await fetchWithAuth('https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/timer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: requestData
        });
  
        if (response.status >= 200 && response.status < 300) {
          const newTimerId = response.data; // `data` 필드에서 타이머 ID를 가져옵니다
  
          // 새 타이머의 ID를 사용하여 상태를 변경
          const timerState = 0;
          const part = -1;
  
          try {
            const stateResponse = await fetchWithAuth(
              `https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/timer/state/${newTimerId}?date=${date}&timerState=${timerState}&part=${part}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
  
            if (stateResponse.status >= 200 && stateResponse.status < 300) {
              console.log('API Response:', stateResponse.data);
              setTimerSettings({
                id: newTimerId,
                cycle: parseFloat(selectedInterval.value),
                settingByUser: selectedMode === 'custom',
                parts: cycles.map(cycle => ({
                  partIds: cycle.bodyParts.map(part => part.id)
                })),
                name: newTimerName.trim() || '새로운 타이머'
              });
              navigate('/timer-running', { state: { timerId: newTimerId } });
            } else {
              console.error('API Error:', stateResponse.status, stateResponse.data);
            }
          } catch (error) {
            console.error('Network Error:', error.message || error);
          }
  
        } else {
          console.error('API Error:', response.status, response.data);
        }
      } catch (error) {
        console.error('Network Error:', error.message || error);
      }
    } else {
      // 타이머 아이디가 있는 경우 기존 타이머 상태 변경
      const timerState = 0;
      const part = -1;
  
      try {
        const response = await fetchWithAuth(
          `https://port-0-backend-lzifzlxv44c22816.sel4.cloudtype.app/api/v1/timer/state/${timerId}?date=${date}&timerState=${timerState}&part=${part}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (response.status >= 200 && response.status < 300) {
          console.log('API Response:', response.data);
          navigate('/timer-running', { state: { timerId } });
        } else {
          console.error('API Error:', response.status, response.data);
        }
      } catch (error) {
        console.error('Network Error:', error.message || error);
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
            <button className='timerSetup-startBtn'onClick={handleStartDevelopment}>
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

