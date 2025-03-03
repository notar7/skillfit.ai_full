import React from 'react';
import logo from '../assets/Logo.png';

export default function SkillfitIcon() {
  return (
    <img
      src={logo} // Replace 'path-to-your-logo.png' with the correct relative path to your logo file.
      alt="SkillfitAI Logo"
      style={{
        height: '38px', 
        width: '120px',
        marginRight: '8px' // equivalent to `mr: 2` in Material-UI
      }}
    />
  );
}
