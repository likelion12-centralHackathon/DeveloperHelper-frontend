import React, { useState } from 'react';
import '../assets/styles/RatingStars.css';

const RatingStars = ({ rating, onRatingChange }) => {
    const handleClick = (index) => {
        onRatingChange(index + 1); // 클릭한 별의 인덱스 + 1을 전달
    };

    return (
        <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star, index) => (
                <span
                    key={index}
                    className={`star ${index < rating ? 'filled' : ''}`}
                    onClick={() => handleClick(index)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default RatingStars;