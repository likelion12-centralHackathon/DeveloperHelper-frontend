import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/DropDown.js';
import TimerModal from '../components/TimerModal.js';
import '../assets/styles/TimerSetup.css';
import startBtn from '../assets/img/startBtn.svg';
import timerMentBg from '../assets/img/timerMent_bg.svg';
import mainIcon from '../assets/img/main_icon.svg';

const intervals = [
  { value: '1시간', label: '30분' },
  { value: '2시간', label: '1시간' },
  { value: '3시간', label: '1시간 30분' },
  { value: '3시간', label: '2시간' },
  { value: '3시간', label: '2시간 30분' },
  { value: '3시간', label: '3시간' },
  { value: '3시간', label: '3시간 30분' },
  { value: '3시간', label: '4시간' },
  { value: '3시간', label: '4시간 30분' },
  { value: '3시간', label: '5시간' }
];

const bodyParts = [
  { value: '눈', label: '눈' },
  { value: '목', label: '목' },
  { value: '허리', label: '허리' },
  { value: '다리', label: '다리' },
  { value: '기타', label: '기타' }
];

function TimerSetup() {
  const navigate = useNavigate();

  const [timers, setTimers] = useState([]);
  const [selectedTimerIndex, setSelectedTimerIndex] = useState(null);
  const [timerSettings, setTimerSettings] = useState({});
  const [selectedInterval, setSelectedInterval] = useState(intervals[1]);
  const [selectedMode, setSelectedMode] = useState('custom');
  const [cycles, setCycles] = useState([{ id: Date.now(), bodyParts: [bodyParts[0]] }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTimerName, setNewTimerName] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('timerData');
    if (storedData) {
      setTimerSettings(JSON.parse(storedData));
    }
  }, []);

  const handleStartClick = () => {
    if (selectedTimerIndex !== null) {
      const updatedSettings = {
        ...timerSettings,
        [selectedTimerIndex]: {
          selectedInterval,
          selectedMode,
          cycles,
        },
      };
      setTimerSettings(updatedSettings);
      localStorage.setItem('timerData', JSON.stringify(updatedSettings));
    }
    navigate('/timer-running');
  };

  const addTimer = () => {
    const newTimer = { name: '새로운 타이머' };
    setTimers((prevTimers) => {
      const updatedTimers = [newTimer, ...prevTimers];
      setSelectedTimerIndex(0);
      return updatedTimers;
    });
    setSelectedInterval(intervals[1]);
    setSelectedMode('custom');
    setCycles([{ id: Date.now(), bodyParts: [bodyParts[0]] }]);
  };

  const selectTimer = (index) => {
    setSelectedTimerIndex(index);
    const settings = timerSettings[index];
    if (settings) {
      setSelectedInterval(settings.selectedInterval);
      setSelectedMode(settings.selectedMode);
      setCycles(settings.cycles);
    } else {
      setSelectedInterval(intervals[1]);
      setSelectedMode('custom');
      setCycles([{ id: Date.now(), bodyParts: [bodyParts[0]] }]);
    }
    setNewTimerName(timers[index]?.name || '');
  };

  const saveSettings = () => {
    setIsModalOpen(true); // Open the modal to edit the timer name
  };

  const handleModalSave = () => {
    const updatedTimers = timers.map((timer, index) =>
      index === selectedTimerIndex ? { ...timer, name: newTimerName } : timer
    );
    setTimers(updatedTimers);
    setIsModalOpen(false);

    if (selectedTimerIndex !== null) {
      const updatedSettings = {
        ...timerSettings,
        [selectedTimerIndex]: {
          selectedInterval,
          selectedMode,
          cycles,
        },
      };
      setTimerSettings(updatedSettings);
      localStorage.setItem('timerData', JSON.stringify(updatedSettings));
    }
  };

  const addCycle = () => {
    if (cycles.length < 4) {
      setCycles([...cycles, { id: Date.now(), bodyParts: [bodyParts[0]] }]);
    }
  };

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
                key={index}
                className={`timerBtn ${selectedTimerIndex === index ? 'selected' : ''}`}
                onClick={() => selectTimer(index)}
              >
                {timer.name}
              </div>
            ))}
          </div>
        </div>
        <div className='timer-explanation-container'>
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
            <button className="timerSetup-startBtn" onClick={handleStartClick}>
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


