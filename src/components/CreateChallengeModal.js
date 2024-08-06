import React, { useState } from 'react';
import '../assets/styles/CreateChallengeModal.css';
import backBtn from '../assets/img/back_arrow.svg';
import handCursor from '../assets/img/HandCursor.svg';

function CreateChallengeModal({ isModalOpen, closeModal, saveChallenge }) {
    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item) => {
            images[item.replace('./', '')] = r(item);
        });
        return images;
    };

    const icons = importAll(require.context('../assets/img/challengeIcon', false, /\.(svg)$/));

    const [currentStep, setCurrentStep] = useState(1);
    const [newChallenge, setNewChallenge] = useState({
        category: '',
        title: '',
        description: '',
        icon: '',
        duration: '',
        validationMethod: '',
        caution: '',
    });
    const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewChallenge(prevChallenge => ({ ...prevChallenge, [name]: value }));
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setNewChallenge(prevChallenge => ({ ...prevChallenge, category }));
        handleNextStep();
    };

    const handleIconSelect = (icon) => {
        setNewChallenge(prevChallenge => ({ ...prevChallenge, icon }));
        setIsIconSelectorOpen(false);
    };

    const handleSubmit = () => {
        saveChallenge(newChallenge);
        closeModal();
    };

    const filteredIcons = Object.keys(icons)
        .filter((key) => key.includes(selectedCategory))
        .map((key) => icons[key]);

    if (!isModalOpen) {
        return null;
    }

    return (
        <div className='overlay'>
            <div className="CreateChallengeModal-container">
                <div className="CreateChallengeModal">
                    {currentStep === 1 && (
                        <div className='createChallengeModalFirst'>
                            <h2>챌린지를 나타내는 색상과<br />이미지를 정해주세요</h2>
                            {newChallenge.icon && (
                                <div className="selected-icon-preview">
                                    <img src={newChallenge.icon} alt="selected icon" />
                                </div>
                            )}
                            <button className='chooseIconBtn' onClick={() => setIsIconSelectorOpen(true)}>+</button>
                            {isIconSelectorOpen && (
                                <div className="icon-selector">
                                    {filteredIcons.map((icon, index) => (
                                        <img
                                            key={index}
                                            src={icon.default}
                                            alt={`icon-${index}`}
                                            onClick={() => handleIconSelect(icon.default)}
                                            className={newChallenge.icon === icon.default ? 'selected' : ''}
                                        />
                                    ))}
                                </div>
                            )}
                            <div className='chooseCategory'>
                                <div className='category develope' onClick={() => handleCategorySelect('개발')}>개발</div>
                                <div className='category health' onClick={() => handleCategorySelect('건강')}>건강</div>
                                <div className='category free' onClick={() => handleCategorySelect('자유')}>자유</div>
                            </div>
                            <button className='continueBtn' onClick={handleNextStep}>계속하기</button>
                        </div>
                    )}
                    {currentStep === 2 && (
                        <div className='createChallengeModalSecond'>
                            <button className='backBtn' onClick={handlePreviousStep}>
                                <img src={backBtn} alt='back' />
                            </button>
                            <div className='challengeInput-container'>
                                <div className='name-container'>
                                    <input name="title" placeholder="제목" onChange={handleChange} />
                                </div>
                                <hr className='inputLine' />
                                <div className='description-container'>
                                    <textarea name="description" placeholder="소개" onChange={handleChange}></textarea>
                                </div>
                                <hr className='inputLine' />
                                <div className='showCategory'>{newChallenge.category}</div>
                                {newChallenge.icon && (
                                    <div className="selected-icon-preview">
                                        <img src={newChallenge.icon} alt="selected icon" />
                                    </div>
                                )}
                                <div className='createChallengeDetail'>
                                    <p>챌린지 조건<br />*인증방법과 기간은 필수</p>
                                    <div className='detail-input'>
                                        <img src={handCursor} alt='hand cursor' />
                                        <p>인증방법</p>
                                        <input name="validationMethod" placeholder="인증방법" onChange={handleChange} />
                                    </div>
                                    <div className='detail-input'>
                                        <img src={handCursor} alt='hand cursor' />
                                        <p>진행기간</p>
                                        <input name="duration" placeholder="진행 기간" onChange={handleChange} />
                                    </div>
                                    <div className='detaiTitle'>
                                        <img src={handCursor} alt='hand cursor' />
                                        <p>주의사항</p>
                                        <input name="caution" placeholder="주의사항" onChange={handleChange} />
                                    </div>
                                </div>
                                <button className='createBtn' onClick={handleSubmit}>생성하기</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateChallengeModal;



