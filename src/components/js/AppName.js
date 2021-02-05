import React from 'react';
import Logo from '../../assets/logo.png';
import { useHistory } from 'react-router-dom';

const AppName = () => {
  const history = useHistory();
  return (
    <div
      className='app-name'
      onClick={() => history.push('/')}
      style={{ cursor: 'pointer' }}
    >
      <img src={Logo} alt='MangaHaven logo' />
      <p>MangaHaven</p>
    </div>
  );
};

export default AppName;
