import React from 'react';
import '../assets/styles/TimerModal.css'

function TimerModal({ isOpen, onClose, onSave, value, onChange }) {
  if (!isOpen) return null;

  return (
    <div className='createChallengeOverlay'>
      <div className='timer-name-modal'>
      <div className='timer-name-modal-content'>
        <p>타이머 이름 수정</p>
        <input 
          type='text' 
          value={value} 
          onChange={onChange} 
          placeholder='타이머 이름 입력'
        />
        <button onClick={onSave}>저장</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
    </div>
  );
}

export default TimerModal;
