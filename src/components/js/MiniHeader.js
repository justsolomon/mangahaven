import React from 'react';
import BackButton from './BackButton.js';
import { useHistory } from 'react-router';
import '../css/MiniHeader.css';

const MiniHeader = ({ currentMenu }) => {
  const history = useHistory();
  return (
    <div className='mini-header'>
      <BackButton clickAction={() => history.push('/')} />
      <p className='current-menu'>{currentMenu}</p>
    </div>
  );
};

export default MiniHeader;
