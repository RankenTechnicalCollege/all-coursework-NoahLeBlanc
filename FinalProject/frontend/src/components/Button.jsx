// src/components/Button.jsx
import React from 'react';
import './Button.css'; // optional CSS module or regular CSS

const Button = ({ text, onClick }) => {
  return (
    <button className="btn" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
