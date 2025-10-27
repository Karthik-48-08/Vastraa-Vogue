import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackArrow.css';

const BackArrow = () => {
  const navigate = useNavigate();

  return (
    <button className="back-arrow" onClick={() => navigate(-1)}>
      ←
    </button>
  );
};

export default BackArrow;